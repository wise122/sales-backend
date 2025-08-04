const express = require('express');
const router = express.Router();
const CheckIn = require('../models/CheckIn');
const User = require('../models/User');
const Outlet = require('../models/Outlet');
const cloudinary = require('../config/cloudinary');
const upload = require('../middleware/cloudinaryUpload'); // Middleware upload ke Cloudinary

// POST Check-In (upload selfie ke Cloudinary)
router.post('/', upload.single('selfie'), async (req, res) => {
  try {
    const { outletId, latitude, longitude, user_id } = req.body;
    const selfieUrl = req.file?.path; // URL Cloudinary

    if (!outletId || !latitude || !longitude || !selfieUrl || !user_id) {
      return res.status(400).json({ message: 'Data check-in tidak lengkap' });
    }

    const newCheckIn = new CheckIn({
      outletId,
      latitude,
      longitude,
      selfie: selfieUrl,
      user_id: user_id,
    });

    await newCheckIn.save();
    console.log('✅ Check-In berhasil:', newCheckIn);
    res.json({ message: 'Check-In berhasil', data: newCheckIn });
  } catch (error) {
    console.error('❌ Error simpan checkin:', error);
    res.status(500).json({ message: 'Gagal menyimpan check-in', error: error.message });
  }
});

// GET History Check-In
router.get('/', async (req, res) => {
  try {
    const data = await CheckIn.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal ambil data check-in' });
  }
});

router.get('/active/:user_id/:outletId', async (req, res) => {
    const { user_id, outletId } = req.params;
    try {
      const checkin = await CheckIn.findOne({
        user_id,
        outletId,
        checkout_time: { $exists: false },
      });
      res.json({ active: !!checkin, checkinId: checkin?._id || null });
    } catch (error) {
      res.status(500).json({ message: 'Gagal cek check-in aktif', error: error.message });
    }
  });

// GET Active Check-In per outletId
router.get('/active/:outletId', async (req, res) => {
  try {
    const { outletId } = req.params;
    const checkin = await CheckIn.findOne({ outletId, checkout_time: { $exists: false } });
    res.json({ active: !!checkin, checkinId: checkin?._id || null });
  } catch (error) {
    res.status(500).json({ message: 'Gagal cek check-in aktif' });
  }
});


// GET Riwayat Check-In/Out berdasarkan user_id
router.get('/history/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
      const history = await CheckIn.find({ user_id }).sort({ createdAt: -1 });
      res.json({ message: 'Riwayat ditemukan', data: history });
    } catch (error) {
      console.error('❌ Error ambil riwayat:', error);
      res.status(500).json({ message: 'Gagal mengambil riwayat', error: error.message });
    }
  });
  

// POST Checkout (upload checkout_photo ke Cloudinary)
router.post('/checkout', upload.single('checkout_photo'), async (req, res) => {
  try {
    const { checkinId } = req.body;
    const checkoutPhotoUrl = req.file?.path;

    if (!checkinId || !checkoutPhotoUrl) {
      return res.status(400).json({ message: 'Data checkout tidak lengkap' });
    }

    const checkin = await CheckIn.findById(checkinId);
    if (!checkin) {
      return res.status(404).json({ message: 'Data check-in tidak ditemukan' });
    }

    const checkoutTime = new Date();
    const durationMinutes = Math.floor((checkoutTime - checkin.createdAt) / 60000);

    checkin.checkout_time = checkoutTime;
    checkin.checkout_photo = checkoutPhotoUrl;
    checkin.duration_minutes = durationMinutes;

    await checkin.save();

    // ✅ Tambahkan +1 ke "call" di tabel user
    await User.findOneAndUpdate(
        { user_id: checkin.user_id },
        { $inc: { call: 1 } },
        { new: true }
      );

      // 🟢 Update lastVisit pada Outlet terkait
    await Outlet.findOneAndUpdate(
        { id: checkin.outletId },
        { lastVisit: checkoutTime }
      );

    res.json({ message: 'Berhasil checkout', data: checkin });
  } catch (error) {
    console.error('❌ Checkout error:', error);
    res.status(500).json({ message: 'Gagal checkout', error: error.message });
  }
});

module.exports = router;
