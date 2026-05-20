// models/BlogPost.js
// Blog post schema — travel story/journal entry

const mongoose = require('mongoose');
const slugify = require('slugify');

// Comment sub-schema
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // For anonymous comments (name only)
    guestName: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    isApproved: {
      type: Boolean,
      default: false, // Admin must approve comments
    },
  },
  { timestamps: true }
);

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    // Rich HTML content from the editor
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    // Short excerpt for cards/previews
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    coverImageId: {
      type: String,
      default: '',
    },
    // Parent country
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
    },
    // Specific place this post is about
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    // Publish status
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    // Reading time in minutes (auto-calculated)
    readingTime: {
      type: Number,
      default: 0,
    },
    // Likes — store user IDs who liked the post
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Comments array
    comments: [commentSchema],
    publishedAt: {
      type: Date,
    },
    views: { type: Number, default: 0 }, 
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: likes count
blogPostSchema.virtual('likesCount').get(function () {
  return this.likes.length;
});

// Virtual: approved comments
blogPostSchema.virtual('approvedComments').get(function () {
  return this.comments.filter((c) => c.isApproved);
});

// Auto-generate slug and calculate reading time before saving
blogPostSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  if (this.isModified('content')) {
    // ~200 words per minute reading speed
    const wordCount = this.content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
