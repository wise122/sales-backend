const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { user_id, password } = req.body;
  console.log("LOGIN attempt:", { user_id, password });

  try {
    const user = await User.findOne({ user_id });
    console.log("USER from DB:", user);

    if (!user || user.password !== password) {
      console.log("PASSWORD mismatch or user not found");
      return res.status(401).json({ message: 'User ID atau Password salah' });
    }

    res.json({
      message: 'Login berhasil',
      user: {
        user_id: user.user_id,
        name: user.name,
        segment: user.segment,
        call: user.call,
        totalSales: user.totalSales,
        email: user.email,
        nik: user.nik,
        alamat: user.alamat,
        ttl: user.ttl,
        lokasi_cabang: user.lokasi_cabang,  // ✅ tambahkan ini
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// POST /api/auth/check-segment
router.post('/check-segment', async (req, res) => {
  const { user_id, targetSegment } = req.body;
  try {
    const user = await User.findOne({ user_id });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    if (user.segment === 'RETAIL' && targetSegment !== 'RETAIL') {
      return res.status(403).json({ message: 'RETAIL tidak boleh input WHOLESALER/AGEN' });
    }

    res.json({ allowed: true });
  } catch (err) {
    console.error('Check segment error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// GET /api/auth/user/:user_id
router.get('/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findOne({ user_id }, '-password');
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// GET /api/auth/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// POST /api/auth/users (tambah user baru)
router.post('/users', async (req, res) => {
  try {
    const {
      user_id,
      name,
      segment,
      call,
      totalSales,
      email,
      nik,
      alamat,
      ttl,
      lokasi_cabang,
    } = req.body;

    const newUser = new User({
      user_id,
      password: '123456',
      name,
      segment,
      call: call || 0,
      totalSales: totalSales || 0,
      email: email || '',
      nik: nik || '',
      alamat: alamat || '',
      ttl: ttl || '',
      lokasi_cabang: lokasi_cabang || null, // ✅ tambahkan
    });

    await newUser.save();

    res.json({ message: 'User berhasil ditambahkan', user: newUser });
  } catch (err) {
    console.error('Add user error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
