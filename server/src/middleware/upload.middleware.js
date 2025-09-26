// server/src/middleware/upload.middleware.js
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function (only allow images & PDFs)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, WebP and PDF are allowed."),
      false
    );
  }
};

// Multer config
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5, // Max 5 files
  },
});

/**
 * Upload file buffer to Cloudinary
 */
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          folder: "healthmitra",
          ...options,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
};

module.exports = {
  upload,
  uploadToCloudinary,
};
