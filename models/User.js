const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  password: { type: String, required: true, default: '123456' },
  name: { type: String, required: true },
  segment: { type: String, required: true },
  call: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  email: { type: String, default: '' },
  nik: { type: String, default: '' },
  alamat: { type: String, default: '' },
  ttl: { type: String, default: '' },
  lokasi_cabang: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);