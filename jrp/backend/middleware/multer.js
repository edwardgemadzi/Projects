const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// File validation function
const fileFilter = (req, file, cb) => {
    // Check file type
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid file type. Only JPEG, PNG, PDF, DOC, and DOCX files are allowed.'), false);
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return cb(new Error('File size too large. Maximum size is 5MB.'), false);
    }

    cb(null, true);
};

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'jrp_uploads',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
        transformation: [
            { width: 1000, height: 1000, crop: 'limit' }, // Limit image dimensions
            { quality: 'auto:good' } // Optimize quality
        ],
        resource_type: 'auto'
    },
});

const parser = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1 // Only one file at a time
    }
});

module.exports = parser;