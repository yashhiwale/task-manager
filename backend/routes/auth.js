const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { upload } = require('../cloudinary');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Standalone endpoint handler capturing direct multer lifecycle events
router.post('/upload-avatar', authMiddleware, (req, res, next) => {
  upload.single('avatar')(req, res, async function (err) {
    if (err) {
      console.error("CRITICAL BACKEND MULTED ERROR:", err.message);
      return res.status(400).json({ 
        message: 'Cloudinary upload failed', 
        error: err.message 
      });
    }

    try {
      if (!req.file || !req.file.path) {
        return res.status(400).json({ message: 'No file metadata generated from cloud storage' });
      }

      const userId = req.user.id;
      const imageUrl = req.file.path;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { avatar: imageUrl },
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ message: 'User reference lookup failed inside DB' });
      }

      return res.status(200).json({
        message: 'Profile picture updated successfully',
        user: updatedUser
      });
    } catch (dbError) {
      console.error("DATABASE PERSISTENCE ERROR:", dbError.message);
      return res.status(500).json({ message: 'Server database failure during write sync' });
    }
  });
});

module.exports = router;