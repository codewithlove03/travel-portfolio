// controllers/authController.js
// Handles user registration, login, and profile

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper: Generate signed JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Helper: Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

// ─── POST /api/auth/register ──────────────────────────────────────────────────
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  // First registered user gets admin role
  const userCount = await User.countDocuments();
  const role = userCount === 0 ? 'admin' : 'user';

  const user = await User.create({ name, email, password, role });
  sendTokenResponse(user, 201, res);
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  sendTokenResponse(user, 200, res);
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  // req.user is set by the protect middleware
  res.status(200).json({ success: true, user: req.user });
};

// ─── PUT /api/auth/update-profile ─────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  const { name, bio, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, bio, avatar },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, user });
};
