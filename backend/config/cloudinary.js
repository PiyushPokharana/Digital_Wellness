const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

/**
 * Cloudinary Configuration
 * Handles direct file uploads to cloud storage without saving locally
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary directly from buffer
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} resourceType - Type of resource: 'image', 'video', 'raw' (for PDFs, ZIPs)
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<Object>} Cloudinary upload result with secure URL
 */
const uploadToCloudinary = async (fileBuffer, resourceType = 'auto', folder = 'student-works') => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: resourceType === 'auto' ? 'auto' : resourceType,
      folder: folder,
      use_filename: true,
      unique_filename: true,
    };

    // Upload from buffer
    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            resource_type: result.resource_type,
            format: result.format,
            bytes: result.bytes
          });
        }
      }
    ).end(fileBuffer);
  });
};

/**
 * Determine resource type based on MIME type
 * @param {string} mimetype - MIME type of the file
 * @returns {string} Cloudinary resource type
 */
const getResourceType = (mimetype) => {
  if (mimetype.startsWith('image/')) {
    return 'image';
  } else if (mimetype.startsWith('video/')) {
    return 'video';
  } else {
    return 'raw'; // For PDFs, ZIPs, and other files
  }
};

/**
 * Upload large file to Cloudinary directly from disk using chunking
 * @param {string} filePath - Path to local file
 * @param {string} resourceType - Type of resource: 'image', 'video', 'raw'
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<Object>} Cloudinary upload result with secure URL
 */
const uploadLargeToCloudinary = async (filePath, resourceType = 'auto', folder = 'student-works') => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: resourceType === 'auto' ? 'auto' : resourceType,
      folder: folder,
      use_filename: true,
      unique_filename: true,
      chunk_size: 20000000 // 20MB chunk size
    };

    cloudinary.uploader.upload_large(filePath, uploadOptions, (error, result) => {
      if (error) {
        console.error('Cloudinary upload_large error:', error);
        reject(error);
      } else {
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
          format: result.format,
          bytes: result.bytes
        });
      }
    });
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  uploadLargeToCloudinary,
  getResourceType
};
