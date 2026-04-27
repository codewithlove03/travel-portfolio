// routes/places.js
const express = require('express');
const router = express.Router();
const {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  addImages,
  deletePlace,
} = require('../controllers/placeController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getAllPlaces);
router.get('/:id', getPlaceById);
router.post('/', protect, adminOnly, upload.single('coverImage'), createPlace);
router.put('/:id', protect, adminOnly, upload.single('coverImage'), updatePlace);
router.post('/:id/images', protect, adminOnly, upload.array('images', 20), addImages);
router.delete('/:id', protect, adminOnly, deletePlace);

module.exports = router;
