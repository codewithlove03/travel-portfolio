// models/BucketItem.js
// Places the owner wants to visit — not yet visited

const mongoose = require('mongoose');
const slugify = require('slugify');

const bucketItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
    },
    slug: { type: String, unique: true },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    continent: {
      type: String,
      enum: ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'],
    },
    flag: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    coverImageId: { type: String, default: '' },
    description: { type: String, maxlength: 500 },
    // Why the owner wants to go
    reason: { type: String, maxlength: 300 },
    // Priority: high, medium, low
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    // Tags like 'beach', 'adventure', 'food'
    tags: [{ type: String, lowercase: true, trim: true }],
    // Estimated year to visit
    targetYear: { type: Number },
    // Has this been completed? (moved to visited)
    isCompleted: { type: Boolean, default: false },
    // Coordinates for map pin
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

bucketItemSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name + '-' + this.country, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('BucketItem', bucketItemSchema);
