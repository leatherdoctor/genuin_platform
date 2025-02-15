const { getCachedData } = require('../services/cacheService');
const Video = require('../models/Video');
const Group = require('../models/Group');
const { Op } = require('sequelize');
const Community = require('../models/Community');
const db = require('../models');

exports.getRecentVideos = async (req, res) => {
  const { brand_id } = req.query;

  try {
    const cacheKey = `recent_videos:${brand_id || 'all'}`;
    const videos = await getCachedData(cacheKey, async () => {
      const whereClause = brand_id ? { groupId: { [Op.in]: await getGroupIdsForBrand(brand_id) } } : {};
      return Video.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: 10,
      });
    });

    res.json(videos);
  } catch (error) {
    console.error('❌ Error fetching recent videos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMostDiscussedVideos = async (req, res) => {
  const { brand_id } = req.query;

  try {
    const cacheKey = `most_discussed_videos:${brand_id || 'all'}`;

    const videos = await getCachedData(cacheKey, async () => {
      const whereClause = brand_id ? { groupId: { [Op.in]: await getGroupIdsForBrand(brand_id) } } : {};
      return Video.findAll({
        where: whereClause,
        order: [['comments', 'DESC']],
        limit: 10,
      });
    });

    res.json(videos);
  } catch (error) {
    console.error('❌ Error fetching most discussed videos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Modified brand-specific endpoint to use cache
const axios = require('axios');

exports.getMostDiscussedVideosForBrand = async (req, res) => {
  const { brand_id } = req.params;

  if (!brand_id || isNaN(brand_id)) {
    return res.status(400).json({ error: "Invalid brand_id" });
  }

  try {
    // Fetch all videos from the /videos/highlights endpoint
    const response = await axios.get('http://localhost:3000/videos/highlights');
    const allVideos = response.data; // Extract videos from API response

    // Filter videos where `id` matches the provided `brand_id`
    const filteredVideos = allVideos.filter(video => video.id === parseInt(brand_id));

    // If no videos found for the given brand_id, return an empty array
    if (filteredVideos.length === 0) {
      return res.json({ message: "No videos found for this brand." });
    }

    // Return the filtered videos (limit to 10 if needed)
    res.json(filteredVideos.slice(0, 10));
  } catch (error) {
    console.error('❌ Error fetching videos from /videos/highlights:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Keep the original helper function but it won't be used for brand filtering anymore
async function getGroupIdsForBrand(brand_id) {
  try {
    const groups = await Group.findAll({
      where: {
        brandId: brand_id
      },
      attributes: ['id'],
      raw: true
    });
    return groups.map(group => group.id);
  } catch (error) {
    console.error('❌ Error in getGroupIdsForBrand:', error);
    return [];
  }
}

exports.createVideo = async (req, res) => {
  try {
    const { groupId, title, description } = req.body;
    const userId = req.user.userId; // Extract user ID from the authenticated token

    // Find the group by ID
    const group = await db.Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Create the video
    const video = await db.Video.create({
      groupId,
      userId,
      title,
      description,
      views: 0,
      comments: 0,
    });

    res.json(video);
  } catch (error) {
    console.error('❌ Error creating video:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
