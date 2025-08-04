const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema({
    outletId: { type: String, required: true },
    user_id: { type: String, required: true },
    latitude: Number,
    longitude: Number,
    selfie: String, // base64 string
    checkout_photo: String, // base64 string
    createdAt: { type: Date, default: Date.now },
    checkout_time: Date,
    duration_minutes: Number,
});

module.exports = mongoose.model('CheckIn', CheckInSchema);
