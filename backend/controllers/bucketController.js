// controllers/bucketController.js
const BucketItem = require('../models/BucketItem');
const { cloudinary } = require('../config/cloudinary');

// GET /api/bucket — public
exports.getAllItems = async (req, res) => {
  const { priority, continent, completed = 'false' } = req.query;
  const filter = { isCompleted: completed === 'true' };
  if (priority) filter.priority = priority;
  if (continent) filter.continent = continent;

  const items = await BucketItem.find(filter).sort({ priority: 1, createdAt: -1 });
  res.status(200).json({ success: true, count: items.length, data: items });
};

// GET /api/bucket/stats
exports.getStats = async (req, res) => {
  const [total, completed, high, byContinent] = await Promise.all([
    BucketItem.countDocuments(),
    BucketItem.countDocuments({ isCompleted: true }),
    BucketItem.countDocuments({ priority: 'high', isCompleted: false }),
    BucketItem.aggregate([
      { $match: { isCompleted: false } },
      { $group: { _id: '$continent', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);
  res.status(200).json({ success: true, data: { total, completed, remaining: total - completed, high, byContinent } });
};

// POST /api/bucket — admin only
exports.createItem = async (req, res) => {
  const body = req.body;
  if (req.file) { body.coverImage = req.file.path; body.coverImageId = req.file.filename; }
  const item = await BucketItem.create(body);
  res.status(201).json({ success: true, data: item });
};

// PUT /api/bucket/:id — admin only
exports.updateItem = async (req, res) => {
  const body = req.body;
  if (req.file) { body.coverImage = req.file.path; body.coverImageId = req.file.filename; }
  const item = await BucketItem.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
  res.status(200).json({ success: true, data: item });
};

// DELETE /api/bucket/:id — admin only
exports.deleteItem = async (req, res) => {
  const item = await BucketItem.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
  if (item.coverImageId) await cloudinary.uploader.destroy(item.coverImageId);
  await item.deleteOne();
  res.status(200).json({ success: true, message: 'Deleted' });
};

// PUT /api/bucket/:id/complete — admin only, marks as visited
exports.markComplete = async (req, res) => {
  const item = await BucketItem.findByIdAndUpdate(
    req.params.id, { isCompleted: true }, { new: true }
  );
  res.status(200).json({ success: true, data: item });
};
