const mongoose = require('mongoose');

const bonusSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },   // ID custom dari frontend
  name: { type: String, required: true },              // Nama bonus
  description: { type: String, default: '' },          // Deskripsi bonus
  segment: { type: String, enum: ['Retail', 'Wholesale', 'Agen'], required: true },
  productId: { type: String, required: true },         // ID produk yang terkait bonus
  isActive: { type: Boolean, default: true }           // Status aktif/tidak
}, { timestamps: true });

module.exports = mongoose.model('Bonus', bonusSchema);
