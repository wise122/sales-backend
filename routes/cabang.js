const express = require('express');
const router = express.Router();
const Cabang = require('../models/Cabang');

router.get('/', async (req, res) => {
    console.log('✅ /api/cabang dipanggil');
    const data = await Cabang.find();
    res.json(data);
  });
  

// Add new branch
router.post('/', async (req, res) => {
  const newCabang = new Cabang(req.body);
  await newCabang.save();
  res.json(newCabang);
});

// Update branch
router.put('/:id', async (req, res) => {
  const updated = await Cabang.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete branch
router.delete('/:id', async (req, res) => {
  await Cabang.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
