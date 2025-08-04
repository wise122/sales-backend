const express = require('express');
const multer = require('multer');
const router = express.Router();
const { cloudinary, storage } = require('../utils/cloudinary');

const upload = multer({ storage });

router.post('/', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'ktpPhoto', maxCount: 1 },
]), async (req, res) => {
  try {
    // Log API key saat request masuk
    console.log('Cloudinary API Key:', cloudinary.config().api_key);

    if (!req.files || !req.files.photo || !req.files.ktpPhoto) {
      return res.status(400).json({ message: 'Foto tidak lengkap' });
    }

    const photoUrl = req.files.photo[0].path;     // URL Cloudinary
    const ktpPhotoUrl = req.files.ktpPhoto[0].path;

    res.json({ photoUrl, ktpPhotoUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload gagal', error: error.message });
  }
});

module.exports = router;
