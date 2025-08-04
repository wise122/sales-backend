const mongoose = require('mongoose');

const diskonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  value: { type: Number, required: true },
  segment: { type: String, enum: ['Retail', 'Wholesale', 'Agen'], required: true },
  isActive: { type: Boolean, default: true },
  productId: { type: String, required: true }  // tambahkan field productId
}, { timestamps: true });

module.exports = mongoose.model('Diskon', diskonSchema);
