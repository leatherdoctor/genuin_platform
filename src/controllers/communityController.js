const { getCachedData } = require('../services/cacheService');
const Community = require('../models/Community');
const db = require('../models');

// Get recent communities
exports.getRecentCommunities = async (req, res) => {
  try {
    const cacheKey = 'recent_communities';

    // Use the caching service to fetch or cache data
    const communities = await getCachedData(cacheKey, async () => {
      const recentCommunities = await Community.findAll({
        order: [['createdAt', 'DESC']],
        limit: 10,
      });
      return recentCommunities;
    });

    res.json(communities);
  } catch (error) {
    console.error('❌ Error fetching recent communities:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.joinCommunity = async (req, res) => {
  try {
    const { username, communityId } = req.body;

    // Find the user by username
    const user = await db.User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the community by ID
    const community = await db.Community.findByPk(communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Check if the user is already a member of the community
    const existingMembership = await db.CommunityMember.findOne({
      where: { userId: user.id, communityId },
    });
    if (existingMembership) {
      return res.status(400).json({ error: 'User is already a member of this community' });
    }

    // Add the user to the community
    await db.CommunityMember.create({ userId: user.id, communityId });

    res.json({ message: 'User successfully joined the community' });
  } catch (error) {
    console.error('❌ Error joining community:', error);
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

exports.addMembersToCommunity = async (req, res) => {
  try {
    const { communityId, usernames } = req.body;

    // Find the community by ID
    const community = await db.Community.findByPk(communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Find users by usernames
    const users = await db.User.findAll({ where: { username: usernames } });
    if (users.length !== usernames.length) {
      return res.status(400).json({ error: 'One or more usernames are invalid' });
    }

    // Add users to the community
    const memberships = users.map(user => ({
      userId: user.id,
      communityId,
    }));
    await db.CommunityMember.bulkCreate(memberships);

    res.json({ message: 'Members added successfully' });
  } catch (error) {
    console.error('❌ Error adding members to community:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
