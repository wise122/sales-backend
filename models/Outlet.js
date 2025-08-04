const mongoose = require('mongoose');

const outletSchema = new mongoose.Schema({
  id: String,
  name: String,
  owner: String,
  address: String,
  latitude: Number,
  longitude: Number,
  photoPath: String,
  ktpPhotoPath: String,
  sales: { type: Number, default: 0 },
  totalPurchase: { type: Number, default: 0 },
  outstanding: { type: Number, default: 0 },
  lastVisit: { type: Date, default: null },
  segment: {
    type: String,
    enum: ['Retail', 'Wholesale', 'Agen'],
    default: 'Retail',
    required: true
  }
});

module.exports = mongoose.model('Outlet', outletSchema);
