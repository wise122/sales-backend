const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Hardcode Cloudinary config
cloudinary.config({
  cloud_name: 'dpff3zksa',
  api_key: '897239511564866',
  api_secret: 'TvFCl9yUlCBh8uLz8RdPgHyQcO0',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'outlets', // folder Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

module.exports = {
  cloudinary,
  storage,
};
