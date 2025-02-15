const express = require('express');
const groupController = require('../controllers/groupController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /groups/join: Join a group
router.post('/join', authenticateToken, groupController.joinGroup);

// POST /groups/:id/members: Add members to a group
router.post('/:id/members', authenticateToken, groupController.addMembersToGroup);

// GET /groups/recent: Get recent groups
router.get('/recent', groupController.getRecentGroups);

module.exports = router;