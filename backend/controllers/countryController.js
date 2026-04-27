// controllers/countryController.js
// CRUD operations for countries

const Country = require('../models/Country');
const Place = require('../models/Place');
const BlogPost = require('../models/BlogPost');
const { cloudinary } = require('../config/cloudinary');

// ─── GET /api/countries ───────────────────────────────────────────────────────
exports.getAllCountries = async (req, res) => {
  const countries = await Country.find()
    .sort({ visitedAt: -1 })
    .populate('places', 'name slug coverImage')
    .lean();

  res.status(200).json({ success: true, count: countries.length, data: countries });
};

// ─── GET /api/countries/featured ─────────────────────────────────────────────
exports.getFeaturedCountries = async (req, res) => {
  const countries = await Country.find({ isFeatured: true })
    .limit(6)
    .sort({ visitedAt: -1 })
    .lean();

  res.status(200).json({ success: true, data: countries });
};

// ─── GET /api/countries/stats ─────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  const [countryCount, placeCount, blogCount] = await Promise.all([
    Country.countDocuments(),
    Place.countDocuments(),
    BlogPost.countDocuments({ status: 'published' }),
  ]);

  // Count by continent
  const continentStats = await Country.aggregate([
    { $group: { _id: '$continent', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.status(200).json({
    success: true,
    data: { countryCount, placeCount, blogCount, continentStats },
  });
};

// ─── GET /api/countries/:slug ─────────────────────────────────────────────────
exports.getCountryBySlug = async (req, res) => {
  const country = await Country.findOne({ slug: req.params.slug })
    .populate({
      path: 'places',
      select: 'name slug coverImage description tags visitedAt rating',
    })
    .populate({
      path: 'blogs',
      match: { status: 'published' },
      select: 'title slug excerpt coverImage publishedAt readingTime',
    });

  if (!country) {
    return res.status(404).json({ success: false, message: 'Country not found' });
  }

  res.status(200).json({ success: true, data: country });
};

// ─── POST /api/countries ──────────────────────────────────────────────────────
exports.createCountry = async (req, res) => {
  const body = req.body;

  // If an image file was uploaded via multer/cloudinary
  if (req.file) {
    body.coverImage = req.file.path;
    body.coverImageId = req.file.filename;
  }

  const country = await Country.create(body);
  res.status(201).json({ success: true, data: country });
};

// ─── PUT /api/countries/:id ───────────────────────────────────────────────────
exports.updateCountry = async (req, res) => {
  const body = req.body;

  if (req.file) {
    body.coverImage = req.file.path;
    body.coverImageId = req.file.filename;
  }

  const country = await Country.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  if (!country) {
    return res.status(404).json({ success: false, message: 'Country not found' });
  }

  res.status(200).json({ success: true, data: country });
};

// ─── DELETE /api/countries/:id ────────────────────────────────────────────────
exports.deleteCountry = async (req, res) => {
  const country = await Country.findById(req.params.id);

  if (!country) {
    return res.status(404).json({ success: false, message: 'Country not found' });
  }

  // Delete cover image from Cloudinary
  if (country.coverImageId) {
    await cloudinary.uploader.destroy(country.coverImageId);
  }

  // Cascade delete places and blogs
  await Place.deleteMany({ country: country._id });
  await BlogPost.deleteMany({ country: country._id });

  await country.deleteOne();
  res.status(200).json({ success: true, message: 'Country and related data deleted' });
};
