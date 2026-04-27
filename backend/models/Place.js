// models/Place.js
// Place schema — city/location within a country

const mongoose = require('mongoose');
const slugify = require('slugify');

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
    },
    slug: {
      type: String,
    },
    // Parent country
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: [true, 'Country reference is required'],
    },
    description: {
      type: String,
      maxlength: [800, 'Description cannot exceed 800 characters'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    coverImageId: {
      type: String,
      default: '',
    },
    // Gallery of multiple images
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        caption: { type: String, default: '' },
      },
    ],
    visitedAt: {
      type: Date,
    },
    // Lat/lng for map pin
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    // Tags like "beach", "mountains", "food", "history"
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    // Related blog posts
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BlogPost',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate slug
placeSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Place', placeSchema);
