// controllers/countryController.js
const Country  = require('../models/Country');
const Place    = require('../models/Place');
const BlogPost = require('../models/BlogPost');
const { cloudinary } = require('../config/cloudinary');

exports.getAllCountries = async (req, res) => {
  const countries = await Country.find()
    .sort({ visitedAt: -1 })
    .populate('places', 'name slug coverImage')
    .lean();
  res.status(200).json({ success: true, count: countries.length, data: countries });
};

exports.getFeaturedCountries = async (req, res) => {
  const countries = await Country.find({ isFeatured: true })
    .limit(6)
    .sort({ visitedAt: -1 })
    .lean();
  res.status(200).json({ success: true, data: countries });
};

exports.getStats = async (req, res) => {
  const [countryCount, placeCount, blogCount] = await Promise.all([
    Country.countDocuments(),
    Place.countDocuments(),
    BlogPost.countDocuments({ status: 'published' }),
  ]);
  const continentStats = await Country.aggregate([
    { $group: { _id: '$continent', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  res.status(200).json({
    success: true,
    data: { countryCount, placeCount, blogCount, continentStats },
  });
};

exports.getCountryBySlug = async (req, res) => {
  const country = await Country.findOneAndUpdate(
    { slug: req.params.slug },
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate({ path: 'places', select: 'name slug coverImage description tags visitedAt rating' })
    .populate({ path: 'blogs', match: { status: 'published' }, select: 'title slug excerpt coverImage publishedAt readingTime' });

  if (!country) {
    return res.status(404).json({ success: false, message: 'Country not found' });
  }
  res.status(200).json({ success: true, data: country });
};

exports.createCountry = async (req, res) => {
  const body = req.body;
  if (req.file) {
    body.coverImage   = req.file.path;
    body.coverImageId = req.file.filename;
  }
  const country = await Country.create(body);
  res.status(201).json({ success: true, data: country });
};

exports.updateCountry = async (req, res) => {
  const body = req.body;
  if (req.file) {
    body.coverImage   = req.file.path;
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

exports.deleteCountry = async (req, res) => {
  const country = await Country.findById(req.params.id);
  if (!country) {
    return res.status(404).json({ success: false, message: 'Country not found' });
  }
  if (country.coverImageId) {
    await cloudinary.uploader.destroy(country.coverImageId);
  }
  await Place.deleteMany({ country: country._id });
  await BlogPost.deleteMany({ country: country._id });
  await country.deleteOne();
  res.status(200).json({ success: true, message: 'Country and related data deleted' });
};
