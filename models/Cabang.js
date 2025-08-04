const mongoose = require('mongoose');

const cabangSchema = new mongoose.Schema({
  name: String,
  location: String,
  isActive: Boolean
});

module.exports = mongoose.model('Cabang', cabangSchema);
