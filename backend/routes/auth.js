const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { upload } = require('../cloudinary');

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      console.log("Backend Auth Error: No token provided");
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Backend Auth Error: Invalid token", error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Route for uploading Profile Avatar with explicit error catching for Multer
router.post('/upload-avatar', authMiddleware, (req, res) => {
  upload.single('avatar')(req, res, async function (err) {
    if (err) {
      console.error("Multer/Cloudinary Upload Error:", err);
      return res.status(400).json({ message: 'Cloudinary upload failed', error: err.message });
    }

    try {
      if (!req.file) {
        console.log("Backend Error: No file found in req.file");
        return res.status(400).json({ message: 'No file uploaded' });
      }

      console.log("File uploaded to Cloudinary successfully:", req.file.path);
      const userId = req.user.id;
      const imageUrl = req.file.path;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { avatar: imageUrl },
        { new: true }
      ).select('-password');

      res.status(200).json({
        message: 'Profile picture updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error("Database Update Error:", error);
      res.status(500).json({ message: 'Server error during database update' });
    }
  });
});

module.exports = router;