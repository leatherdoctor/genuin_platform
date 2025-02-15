const express = require('express');
const groupMemberController = require('../controllers/groupMemberController');

const router = express.Router();

// POST /group-members/add: Add a user to a group
router.post('/add', groupMemberController.addUserToGroup);

// GET /group-members/:groupId: Get all members of a group
router.get('/:groupId', groupMemberController.getGroupMembers);

module.exports = router;