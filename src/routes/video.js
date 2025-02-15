const express = require('express');
const videoController = require('../controllers/videoController');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');


// POST /videos: Create a new video
router.post('/', authenticateToken, videoController.createVideo);

// GET /videos/recent?brand_id={brand_id}: Get recent videos
router.get('/recent', videoController.getRecentVideos);

// GET /videos/highlights?brand_id={brand_id}: Get most discussed videos
router.get('/highlights', videoController.getMostDiscussedVideos);

// GET /videos/highlights/:brand_id: Get most discussed videos for a specific brand
router.get('/highlights/:brand_id', videoController.getMostDiscussedVideosForBrand);

module.exports = router;