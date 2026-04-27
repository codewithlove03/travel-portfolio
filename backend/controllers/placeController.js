// controllers/placeController.js
// CRUD operations for places/cities

const Place = require('../models/Place');
const Country = require('../models/Country');
const { cloudinary } = require('../config/cloudinary');

// ─── GET /api/places ──────────────────────────────────────────────────────────
exports.getAllPlaces = async (req, res) => {
  const { country } = req.query;
  const filter = country ? { country } : {};

  const places = await Place.find(filter)
    .populate('country', 'name slug flag')
    .sort({ visitedAt: -1 })
    .lean();

  res.status(200).json({ success: true, count: places.length, data: places });
};

// ─── GET /api/places/:id ──────────────────────────────────────────────────────
exports.getPlaceById = async (req, res) => {
  const place = await Place.findById(req.params.id)
    .populate('country', 'name slug flag')
    .populate({
      path: 'blogs',
      match: { status: 'published' },
      select: 'title slug excerpt coverImage publishedAt readingTime',
    });

  if (!place) {
    return res.status(404).json({ success: false, message: 'Place not found' });
  }

  res.status(200).json({ success: true, data: place });
};

// ─── POST /api/places ─────────────────────────────────────────────────────────
exports.createPlace = async (req, res) => {
  const body = req.body;

  // Handle cover image upload
  if (req.file) {
    body.coverImage = req.file.path;
    body.coverImageId = req.file.filename;
  }

  const place = await Place.create(body);

  // Add place reference to the parent country
  await Country.findByIdAndUpdate(body.country, { $push: { places: place._id } });

  res.status(201).json({ success: true, data: place });
};

// ─── PUT /api/places/:id ──────────────────────────────────────────────────────
exports.updatePlace = async (req, res) => {
  const body = req.body;

  if (req.file) {
    body.coverImage = req.file.path;
    body.coverImageId = req.file.filename;
  }

  const place = await Place.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  if (!place) {
    return res.status(404).json({ success: false, message: 'Place not found' });
  }

  res.status(200).json({ success: true, data: place });
};

// ─── POST /api/places/:id/images ──────────────────────────────────────────────
// Upload multiple gallery images
exports.addImages = async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) {
    return res.status(404).json({ success: false, message: 'Place not found' });
  }

  // req.files comes from multer when using .array()
  const newImages = req.files.map((file) => ({
    url: file.path,
    publicId: file.filename,
    caption: '',
  }));

  place.images.push(...newImages);
  await place.save();

  res.status(200).json({ success: true, data: place });
};

// ─── DELETE /api/places/:id ───────────────────────────────────────────────────
exports.deletePlace = async (req, res) => {
  const place = await Place.findById(req.params.id);

  if (!place) {
    return res.status(404).json({ success: false, message: 'Place not found' });
  }

  // Delete all images from Cloudinary
  if (place.coverImageId) {
    await cloudinary.uploader.destroy(place.coverImageId);
  }
  for (const img of place.images) {
    if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
  }

  // Remove place reference from parent country
  await Country.findByIdAndUpdate(place.country, { $pull: { places: place._id } });

  await place.deleteOne();
  res.status(200).json({ success: true, message: 'Place deleted' });
};
