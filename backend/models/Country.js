// models/Country.js
// Country schema — top-level travel entity

const mongoose = require('mongoose');
const slugify = require('slugify');

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Country name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    continent: {
      type: String,
      required: [true, 'Continent is required'],
      enum: ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    // Cloudinary public_id for deletion
    coverImageId: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    visitedAt: {
      type: Date,
      required: [true, 'Visit date is required'],
    },
    // Flag emoji or URL
    flag: {
      type: String,
      default: '',
    },
    // Country code e.g. "JP", "FR"
    countryCode: {
      type: String,
      uppercase: true,
      maxlength: 3,
    },
    // Latitude/Longitude for map marker
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    // Reference to all places within this country
    places: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
      },
    ],
    // Reference to blog posts about this country
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BlogPost',
      },
    ],
  },
  {
    timestamps: true,
    // Virtual fields are included when converting to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate slug from name before saving
countrySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Country', countrySchema);
