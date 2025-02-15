const express = require('express');
const brandController = require('../controllers/brandController');

const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

// GET /brands: Get all brands (Accessible to all authenticated users)
router.get('/', authenticateToken, brandController.getAllBrands);

// POST /brands: Create a new brand (Admin only)
router.post('/', authenticateToken, authorizeRole(['admin']), brandController.createBrand);

// PUT /brands/:id: Update a brand (Admin only)
router.put('/:id', authenticateToken, authorizeRole(['admin']), brandController.updateBrand);

// DELETE /brands/:id: Delete a brand (Admin only)
router.delete('/:id', authenticateToken, authorizeRole(['admin']), brandController.deleteBrand)

// GET /brands/videos/top: Get top brands sorted by video views
router.get('/videos/top', brandController.getTopBrandsByViews);

// GET /brands/videos/top/:brand_id: Get top videos for a specific brand
router.get('/videos/top/:brand_id', brandController.getTopVideosForBrand);

module.exports = router;