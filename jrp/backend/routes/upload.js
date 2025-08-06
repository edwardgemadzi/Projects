const express = require('express');
const router = express.Router();
const parser = require('../middleware/multer'); // this is the multer config for Cloudinary

// Upload endpoint
router.post('/upload', parser.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  res.status(200).json({ url: req.file.path });
});

module.exports = router;