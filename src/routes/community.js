const express = require('express');
const communityController = require('../controllers/communityController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /communities/join: Join a community
router.post('/join', authenticateToken, communityController.joinCommunity);
// GET /communities/recent: Get recent communities
router.get('/recent', communityController.getRecentCommunities);

// POST /communities/:id/members: Add members to a community
router.post('/:id/members', authenticateToken, communityController.addMembersToCommunity);

module.exports = router;