// routes/bucket.js
const express = require('express');
const router = express.Router();
const { getAllItems, getStats, createItem, updateItem, deleteItem, markComplete } = require('../controllers/bucketController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getAllItems);
router.get('/stats', getStats);
router.post('/', protect, adminOnly, upload.single('coverImage'), createItem);
router.put('/:id', protect, adminOnly, upload.single('coverImage'), updateItem);
router.put('/:id/complete', protect, adminOnly, markComplete);
router.delete('/:id', protect, adminOnly, deleteItem);

module.exports = router;
