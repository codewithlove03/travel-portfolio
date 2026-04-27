// routes/countries.js
const express = require('express');
const router = express.Router();
const {
  getAllCountries,
  getFeaturedCountries,
  getStats,
  getCountryBySlug,
  createCountry,
  updateCountry,
  deleteCountry,
} = require('../controllers/countryController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getAllCountries);
router.get('/featured', getFeaturedCountries);
router.get('/stats', getStats);
router.get('/:slug', getCountryBySlug);

// Admin-only routes
router.post('/', protect, adminOnly, upload.single('coverImage'), createCountry);
router.put('/:id', protect, adminOnly, upload.single('coverImage'), updateCountry);
router.delete('/:id', protect, adminOnly, deleteCountry);

module.exports = router;
