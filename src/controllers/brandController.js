const { getCachedData } = require('../services/cacheService');
const Brand = require('../models/Brand');
const Video = require('../models/Video');
const Group = require('../models/Group');
const Community = require('../models/Community');
const sequelize = require('../config/db.config');
const { validateBrandId } = require('../utils/validators'); // Import the validator
const axios = require('axios');

// Get top brands sorted by video views
exports.getTopBrandsByViews = async (req, res) => {
  try {
    const cacheKey = 'top_brands:views';

    // Use the caching service to fetch or cache data
    const brands = await getCachedData(cacheKey, async () => {
      const brandsWithViews = await Brand.findAll({
        attributes: [
          'id',
          'name',
          [
            sequelize.literal(
              '(SELECT SUM(`videos`.`views`) FROM `Videos` AS `videos` INNER JOIN `Groups` AS `groups` ON `videos`.`groupId` = `groups`.`id` INNER JOIN `Communities` AS `communities` ON `groups`.`communityId` = `communities`.`id` WHERE `communities`.`brandId` = `Brand`.`id`)'
            ),
            'total_views',
          ],
        ],
        order: [[sequelize.literal('total_views'), 'DESC']],
        limit: 10,
      });
      return brandsWithViews;
    });

    res.json(brands);
  } catch (error) {
    console.error('❌ Error fetching top brands:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get top videos for a specific brand
exports.getTopVideosForBrand = async (req, res) => {
  try {
    // Validate the brand_id parameter
    const brand_id = validateBrandId(req.params.brand_id);

    // Fetch all top brands from /brands/videos/top
    const response = await axios.get('http://localhost:3000/brands/videos/top');
    const allTopBrands = response.data;

    // Find the specific brand in the top brands list
    const targetBrand = allTopBrands.find((brand) => brand.id === brand_id);

    if (!targetBrand) {
      return res.status(404).json({ error: 'Brand not found in top brands' });
    }

    // Return the found brand
    res.json(targetBrand);
  } catch (error) {
    console.error('❌ Error fetching top videos for brand:', error);
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
  }
};

// Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    // Fetch all brands from the database
    const brands = await Brand.findAll();

    // Return the list of brands
    res.json(brands);
  } catch (error) {
    console.error('❌ Error fetching brands:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new brand (Admin only)
exports.createBrand = async (req, res) => {
  try {
    const { name, websiteUrl, primaryColor, secondaryColor, thumbnailUrl } = req.body;

    // Validate input
    if (!name || !websiteUrl || !primaryColor || !secondaryColor || !thumbnailUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a new brand in the database
    const newBrand = await Brand.create({
      name,
      websiteUrl,
      primaryColor,
      secondaryColor,
      thumbnailUrl,
    });

    // Return the newly created brand
    res.status(201).json(newBrand);
  } catch (error) {
    console.error('❌ Error creating brand:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a brand (Admin only)
exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, websiteUrl, primaryColor, secondaryColor, thumbnailUrl } = req.body;

    // Find the brand by ID
    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // Update the brand details
    await brand.update({
      name,
      websiteUrl,
      primaryColor,
      secondaryColor,
      thumbnailUrl,
    });

    // Return the updated brand
    res.json(brand);
  } catch (error) {
    console.error('❌ Error updating brand:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a brand (Admin only)
exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the brand by ID
    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // Delete the brand
    await brand.destroy();

    // Return success message
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting brand:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};