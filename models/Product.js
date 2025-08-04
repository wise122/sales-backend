const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  hpp: { type: Number, required: true },
  stokAwalTotal: { type: Number, required: true },
  stokAwalSales: { type: Number, required: true },
  hargaRetail: { type: Number, required: true },
  hargaWS: { type: Number, required: true },
  hargaAgen: { type: Number, required: true },
  stokAkhirSales: { type: Number, required: true },
  totalStokAkhir: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
