const GroupMember = require('../models/GroupMember');
const User = require('../models/User');

// Add a user to a group
exports.addUserToGroup = async (req, res) => {
  const { username, groupId } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is already a member of the group
    const existingMember = await GroupMember.findOne({
      where: { userId: user.id, groupId },
    });
    if (existingMember) {
      return res.status(400).json({ error: 'User is already a member of this group' });
    }

    // Add the user to the group
    await GroupMember.create({ userId: user.id, groupId });
    res.json({ message: 'User added to group successfully' });
  } catch (error) {
    console.error('❌ Error adding user to group:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all members of a group
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