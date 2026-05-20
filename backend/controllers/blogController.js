// controllers/blogController.js
// CRUD for blog posts, likes, and comments

const BlogPost = require('../models/BlogPost');
const Country = require('../models/Country');
const Place = require('../models/Place');
const { cloudinary } = require('../config/cloudinary');

// ─── GET /api/blogs ───────────────────────────────────────────────────────────
exports.getAllBlogs = async (req, res) => {
  const { country, tag, status = 'published', page = 1, limit = 10 } = req.query;

  const filter = { status };
  if (country) filter.country = country;
  if (tag) filter.tags = tag;

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    BlogPost.find(filter)
      .populate('country', 'name slug flag')
      .populate('place', 'name slug')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-content -comments') // Don't send full content in list view
      .lean(),
    BlogPost.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: posts,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
  });
};

// ─── GET /api/blogs/:slug ─────────────────────────────────────────────────────
exports.getBlogBySlug = async (req, res) => {
  const post = await BlogPost.findOneAndUpdate(
    { slug: req.params.slug, status: 'published' },
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate('country', 'name slug flag')
    .populate('place', 'name slug')
    .populate('author', 'name avatar')
    .populate('comments.user', 'name avatar');

  if (!post) return res.status(404).json({ success: false, message: 'Blog post not found' });
  res.status(200).json({ success: true, data: post });
};

// ─── POST /api/blogs ──────────────────────────────────────────────────────────
exports.createBlog = async (req, res) => {
  const body = { ...req.body, author: req.user._id };

  if (req.file) {
    body.coverImage = req.file.path;
    body.coverImageId = req.file.filename;
  }

  const post = await BlogPost.create(body);

  // Add blog reference to parent country/place
  if (body.country) {
    await Country.findByIdAndUpdate(body.country, { $push: { blogs: post._id } });
  }
  if (body.place) {
    await Place.findByIdAndUpdate(body.place, { $push: { blogs: post._id } });
  }

  res.status(201).json({ success: true, data: post });
};

// ─── PUT /api/blogs/:id ───────────────────────────────────────────────────────
exports.updateBlog = async (req, res) => {
  const body = req.body;

  if (req.file) {
    body.coverImage = req.file.path;
    body.coverImageId = req.file.filename;
  }

  const post = await BlogPost.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found' });
  }

  res.status(200).json({ success: true, data: post });
};

// ─── DELETE /api/blogs/:id ────────────────────────────────────────────────────
exports.deleteBlog = async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found' });
  }

  if (post.coverImageId) {
    await cloudinary.uploader.destroy(post.coverImageId);
  }

  // Remove references from country/place
  if (post.country) {
    await Country.findByIdAndUpdate(post.country, { $pull: { blogs: post._id } });
  }
  if (post.place) {
    await Place.findByIdAndUpdate(post.place, { $pull: { blogs: post._id } });
  }

  await post.deleteOne();
  res.status(200).json({ success: true, message: 'Blog post deleted' });
};

// ─── POST /api/blogs/:id/like ─────────────────────────────────────────────────
exports.toggleLike = async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found' });
  }

  const userId = req.user._id;
  const alreadyLiked = post.likes.includes(userId);

  if (alreadyLiked) {
    post.likes.pull(userId); // Unlike
  } else {
    post.likes.push(userId); // Like
  }

  await post.save();
  res.status(200).json({
    success: true,
    liked: !alreadyLiked,
    likesCount: post.likes.length,
  });
};

// ─── POST /api/blogs/:id/comment ──────────────────────────────────────────────
exports.addComment = async (req, res) => {
  const { content, guestName } = req.body;

  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found' });
  }

  const comment = {
    content,
    guestName: req.user ? '' : guestName,
    user: req.user ? req.user._id : undefined,
    isApproved: req.user?.role === 'admin', // Auto-approve admin comments
  };

  post.comments.push(comment);
  await post.save();

  res.status(201).json({ success: true, message: 'Comment submitted for review' });
};

// ─── PUT /api/blogs/:id/comment/:commentId/approve ────────────────────────────
exports.approveComment = async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

  const comment = post.comments.id(req.params.commentId);
  if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

  comment.isApproved = true;
  await post.save();

  res.status(200).json({ success: true, message: 'Comment approved' });
};
