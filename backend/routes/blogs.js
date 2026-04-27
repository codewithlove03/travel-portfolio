// routes/blogs.js
const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
  approveComment,
} = require('../controllers/blogController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Public / optional auth
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

// Authenticated
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', optionalAuth, addComment);

// Admin only
router.post('/', protect, adminOnly, upload.single('coverImage'), createBlog);
router.put('/:id', protect, adminOnly, upload.single('coverImage'), updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);
router.put('/:id/comment/:commentId/approve', protect, adminOnly, approveComment);

module.exports = router;
