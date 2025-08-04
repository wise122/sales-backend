const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  qty: String,
  harga: String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userName: { type: String, required: true }, // menyimpan nama user saja
  outletId: { type: String, required: true },  // simpan ID outlet seperti "OUTLET-0001"
  products: [productSchema],
  total: Number,
  signature: String, // base64 PNG (opsional)
  paymentMethod: {
    type: String,
    enum: ['cash', 'online', 'pisah', 'termin7'],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
