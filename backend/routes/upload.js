const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const Work = require('../models/Work');
const { uploadLargeToCloudinary, getResourceType } = require('../config/cloudinary');

const router = express.Router();
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const oauthClient = googleClientId ? new OAuth2Client(googleClientId) : null;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer to store files on disk
// This is critical for handling multi-GB files without crashing Node.js
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File filter to accept specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/quicktime', 'video/x-msvideo',
    'application/pdf',
    'application/zip', 'application/x-zip-compressed'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: images, videos, PDFs, ZIP files'), false);
  }
};

// Configure multer middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2500 * 1024 * 1024 // 2.5GB limit
  }
});

// Custom middleware to handle optional file upload based on content-type
const optionalFileUpload = (req, res, next) => {
  // If content-type is application/json, skip multer (URL-based upload)
  if (req.headers['content-type']?.includes('application/json')) {
    return next();
  }

  // For multipart/form-data, use multer (file upload)
  upload.single('file')(req, res, (err) => {
    // Ignore multer errors if no file is provided (will be validated in route handler)
    if (err && err.code !== 'LIMIT_UNEXPECTED_FILE') {
      return next(err);
    }
    next();
  });
};

// Email validation for IIITN format
const validateIIITNEmail = (email) => {
  const pattern = /^bt\d{2}[a-z]{3}\d{3}@iiitn\.ac\.in$/i;
  return pattern.test(email);
};

const verifyGoogleAuth = async (req, res, next) => {
  try {
    if (!oauthClient) {
      return res.status(500).json({ error: 'Server auth is not configured. Missing GOOGLE_CLIENT_ID.' });
    }

    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Google auth token' });
    }

    const idToken = authHeader.slice('Bearer '.length).trim();
    if (!idToken) {
      return res.status(401).json({ error: 'Invalid Google auth token' });
    }

    const ticket = await oauthClient.verifyIdToken({
      idToken,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    req.authUser = {
      email: (payload?.email || '').toLowerCase(),
      name: payload?.name || '',
      sub: payload?.sub || '',
    };

    if (!req.authUser.email) {
      return res.status(401).json({ error: 'Unable to verify Google account email' });
    }

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Google authentication failed', message: error.message });
  }
};

// Validation rules for form fields
const validateFields = [
  body('name').trim().notEmpty().withMessage('Student name is required'),
  body('roll').trim().notEmpty().withMessage('Roll number is required'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .custom((value) => {
      if (!validateIIITNEmail(value)) {
        throw new Error('Only IIITN students (bt2xxxxxxx@iiitn.ac.in) can upload');
      }
      return true;
    }),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['Comic', 'Website', 'Magazine', 'Skit', 'Other']).withMessage('Valid category is required')
];

/**
 * POST /api/upload
 * Upload student work to cloud storage and save metadata to MongoDB
 * Supports both file uploads and URL-based uploads (for Website/Video categories)
 */
router.post('/', verifyGoogleAuth, optionalFileUpload, validateFields, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const submittedEmail = (req.body.email || '').trim().toLowerCase();
    if (submittedEmail !== req.authUser.email) {
      return res.status(403).json({ error: 'Email must match the signed-in Google account' });
    }

    if (!validateIIITNEmail(req.authUser.email)) {
      return res.status(403).json({ error: 'Only IIITN students with valid BT IDs can upload' });
    }

    const isWebsiteOrVideo = req.body.category === 'Website' || req.body.category === 'Skit';
    let fileUrl = '';
    let fileType = 'other';

    if (isWebsiteOrVideo) {
      // Handle URL-based uploads
      if (!req.body.url || !req.body.url.trim()) {
        return res.status(400).json({ error: `${req.body.category} URL is required` });
      }

      // Validate URL format
      try {
        new URL(req.body.url.trim());
      } catch (e) {
        return res.status(400).json({ error: 'Invalid URL format' });
      }

      fileUrl = req.body.url.trim();
      fileType = req.body.category === 'Website' ? 'website' : 'video';
    } else {
      // Handle file uploads
      if (!req.file) {
        return res.status(400).json({ error: 'File is required' });
      }

      // Check file size (double check, even though multer should handle it)
      if (req.file.size > 2500 * 1024 * 1024) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'File size exceeds 2.5GB limit' });
      }

      // Determine resource type for Cloudinary
      const resourceType = getResourceType(req.file.mimetype);

      try {
        // Upload large file to Cloudinary from disk
        console.log(`Uploading ${req.file.originalname} to Cloudinary...`);
        const cloudinaryResult = await uploadLargeToCloudinary(
          req.file.path,
          resourceType,
          'student-works'
        );

        fileUrl = cloudinaryResult.url;
      } finally {
        // Clean up the local temp file after upload finishes or fails
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }

      // Determine file type for our database
      if (req.file.mimetype.startsWith('image/')) {
        fileType = 'image';
      } else if (req.file.mimetype.startsWith('video/')) {
        fileType = 'video';
      } else if (req.file.mimetype === 'application/pdf') {
        fileType = 'pdf';
      } else if (req.file.mimetype.includes('zip')) {
        fileType = 'zip';
      }
    }

    // Save work metadata to MongoDB Atlas
    const work = new Work({
      name: req.body.name.trim(),
      roll: req.body.roll.trim(),
      email: req.authUser.email,
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      category: req.body.category,
      fileUrl: fileUrl,
      fileType: fileType,
      timestamp: new Date()
    });

    const savedWork = await work.save();

    console.log(`✅ Work uploaded successfully: ${savedWork._id}`);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Work uploaded successfully',
      work: savedWork,
      cloudUrl: fileUrl
    });

  } catch (error) {
    console.error('Upload error:', error);
    // Cleanup on generic error if file exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      error: 'Upload failed',
      message: error.message
    });
  }
});

module.exports = router;
