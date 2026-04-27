// config/cloudinary.js
// Sets up Cloudinary for image uploads and multer-storage integration

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with env credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage engine: uploads go directly to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'travel-portfolio', // Folder name in your Cloudinary account
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [
      { width: 1920, height: 1080, crop: 'limit', quality: 'auto:good' }
    ],
  },
});

// Multer instance — max 10MB per file, max 20 files per request
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

module.exports = { cloudinary, upload };
