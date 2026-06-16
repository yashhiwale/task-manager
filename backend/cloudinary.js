const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

// Direct configuration integration check with strict trimming
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? process.env.CLOUDINARY_CLOUD_NAME.trim() : '',
  api_key: process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.trim() : '',
  api_secret: process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.trim() : '',
  secure: true
});

// Simplified and highly stable configuration storage matrix
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'task-manager-uploads',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    // Let Cloudinary handle the unique public_id automatically to avoid signature mismatch
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB file size limit
});

module.exports = { cloudinary, upload };