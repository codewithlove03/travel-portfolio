// controllers/analyticsController.js
// Returns view stats for admin dashboard

const Country = require('../models/Country');
const Place = require('../models/Place');
const BlogPost = require('../models/BlogPost');

// GET /api/analytics — admin only
exports.getAnalytics = async (req, res) => {
  const [
    topCountries,
    topPlaces,
    topBlogs,
    totalCountryViews,
    totalBlogViews,
    recentlyViewed,
  ] = await Promise.all([
    // Top 5 most viewed countries
    Country.find().sort({ views: -1 }).limit(5).select('name flag views slug'),
    // Top 5 most viewed places
    Place.find().sort({ views: -1 }).limit(5).select('name views').populate('country', 'name flag'),
    // Top 5 most viewed blog posts
    BlogPost.find({ status: 'published' }).sort({ views: -1 }).limit(5).select('title views slug'),
    // Total country views
    Country.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
    // Total blog views
    BlogPost.aggregate([{ $match: { status: 'published' } }, { $group: { _id: null, total: { $sum: '$views' } } }]),
    // Recently viewed blogs (last 5 with views > 0)
    BlogPost.find({ status: 'published', views: { $gt: 0 } })
      .sort({ updatedAt: -1 }).limit(5).select('title views slug publishedAt'),
  ]);

  res.status(200).json({
    success: true,
    data: {
      topCountries,
      topPlaces,
      topBlogs,
      totalCountryViews: totalCountryViews[0]?.total || 0,
      totalBlogViews: totalBlogViews[0]?.total || 0,
      recentlyViewed,
    },
  });
};
