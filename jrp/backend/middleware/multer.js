const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'jrp_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
  },
});

const parser = multer({ storage });

module.exports = parser;