const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Outlet = require('../models/Outlet');


// GET /api/orders/daily-sales/by-user-id/:user_id
router.get('/daily-sales/by-user-id/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
  
      // Cari user berdasarkan user_id
      const user = await User.findOne({ user_id });
      if (!user) {
        return res.status(404).json({ message: 'User tidak ditemukan' });
      }
  
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
  
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
  
      // Cari order berdasarkan nama user dan tanggal hari ini
      const orders = await Order.find({
        userName: user.name,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });
  
      const dailyTotal = orders.reduce((acc, order) => acc + order.total, 0);
  
      res.json({ dailySales: dailyTotal });
    } catch (err) {
      console.error('Gagal ambil sales harian:', err);
      res.status(500).json({ message: 'Gagal ambil sales harian' });
    }
  });


  router.get('/total-sales/by-user-id/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
  
      const user = await User.findOne({ user_id });
      if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
  
      const orders = await Order.find({ userName: user.name });
  
      const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  
      res.json({ totalSales });
    } catch (err) {
      console.error('❌ Gagal ambil total sales:', err);
      res.status(500).json({ error: 'Gagal ambil total sales' });
    }
  });
  
  

// POST /api/orders/submit
router.post('/submit', async (req, res) => {
  try {
    const { user_id, outletId, products, total, signature, paymentMethod } = req.body;

    // Ambil nama user dari user_id
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    // Ambil kode outlet (id)
    const outlet = await Outlet.findOne({ id: outletId });

    if (!outlet) {
      return res.status(404).json({ error: 'Outlet tidak ditemukan' });
    }

    // Simpan order
    const newOrder = new Order({
      userName: user.name,         // Simpan nama user, bukan _id
      outletId: outlet.id,         // Simpan kode outlet (OUTLET-xxx)
      products,
      total,
      signature,
      paymentMethod,
    });

    await newOrder.save();

     // ✅ Tambahkan total order ke totalSales user
     user.totalSales = (user.totalSales || 0) + total;
     await user.save();

    res.json({ message: 'Order berhasil disimpan', order: newOrder });
  } catch (err) {
    console.error('Gagal simpan order:', err);
    res.status(500).json({ error: 'Gagal simpan order' });
  }
});


// routes/orders.js
router.get('/', async (req, res) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      res.json({ orders });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Gagal ambil data' });
    }
  });

  // routes/orders.js
router.get('/by-outlet/:outletId', async (req, res) => {
    try {
      const { outletId } = req.params;
      const orders = await Order.find({ outletId }); // filter berdasarkan outletId string (misal: OUTLET-edi-djru-200)
      res.json({ orders });
    } catch (err) {
      console.error('Gagal ambil data outlet:', err);
      res.status(500).json({ error: 'Gagal ambil data outlet' });
    }
  });
  // GET /api/orders/by-outlet-and-user/:outletId/:user_id
router.get('/by-outlet-and-user/:outletId/:user_id', async (req, res) => {
  try {
    const { outletId, user_id } = req.params;

    // Cari user
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    // Ambil order yang sesuai outlet + dibuat oleh user ini
    const orders = await Order.find({
      outletId,
      userName: user.name,  // karena kita simpan nama user saat order
    }).sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    console.error('Gagal ambil data outlet + user:', err);
    res.status(500).json({ error: 'Gagal ambil data outlet + user' });
  }
});

  

module.exports = router;
