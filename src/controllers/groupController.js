const { getCachedData } = require('../services/cacheService');
const Group = require('../models/Group');
const db = require('../models');

// Get recent groups
exports.getRecentGroups = async (req, res) => {
  try {
    const cacheKey = 'recent_groups';

    // Use the caching service to fetch or cache data
    const groups = await getCachedData(cacheKey, async () => {
      const recentGroups = await Group.findAll({
        order: [['createdAt', 'DESC']],
        limit: 10,
      });
      return recentGroups;
    });

    res.json(groups);
  } catch (error) {
    console.error('❌ Error fetching recent groups:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getGroupMembers = async (req, res) => {
  const { groupId } = req.params;

  try {
    const members = await GroupMember.findAll({
      where: { groupId },
      include: [{ model: User, attributes: ['id', 'username', 'email'] }],
    });
    res.json(members);
  } catch (error) {
    console.error('❌ Error fetching group members:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addMembersToGroup = async (req, res) => {
  try {
    const { groupId, usernames } = req.body;

    // Find the group by ID
    const group = await db.Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Find users by usernames
    const users = await db.User.findAll({ where: { username: usernames } });
    if (users.length !== usernames.length) {
      return res.status(400).json({ error: 'One or more usernames are invalid' });
    }

    // Add users to the group
    const memberships = users.map(user => ({
      userId: user.id,
      groupId,
    }));
    await db.GroupMember.bulkCreate(memberships);

    res.json({ message: 'Members added successfully' });
  } catch (error) {
    console.error('❌ Error adding members to group:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const { username, groupId } = req.body;

    // Find the user by username
    const user = await db.User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the group by ID
    const group = await db.Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if the user is already a member of the group
    const existingMembership = await db.GroupMember.findOne({
      where: { userId: user.id, groupId },
    });
    if (existingMembership) {
      return res.status(400).json({ error: 'User is already a member of this group' });
    }

    // Add the user to the group
    await db.GroupMember.create({ userId: user.id, groupId });

    res.json({ message: 'User successfully joined the group' });
  } catch (error) {
    console.error('❌ Error joining group:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};