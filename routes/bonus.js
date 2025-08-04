const express = require('express');
const router = express.Router();
const Bonus = require('../models/Bonus');

// GET semua bonus
router.get('/', async (req, res) => {
  try {
    const { segment } = req.query;
    const filter = segment ? { segment } : {};
    const data = await Bonus.find(filter);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil bonus', error: err.message });
  }
});

// POST tambah bonus
router.post('/', async (req, res) => {
  try {
    const bonus = new Bonus(req.body);
    await bonus.save();
    res.status(201).json({ message: 'Bonus ditambah', bonus });
  } catch (err) {
    res.status(400).json({ message: 'Gagal tambah bonus', error: err.message });
  }
});

// PUT update bonus
router.put('/:id', async (req, res) => {
  try {
    const updated = await Bonus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Bonus tidak ditemukan' });
    res.json({ message: 'Bonus diupdate', bonus: updated });
  } catch (err) {
    res.status(400).json({ message: 'Gagal update bonus', error: err.message });
  }
});

// DELETE hapus bonus
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Bonus.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Bonus tidak ditemukan' });
    res.json({ message: 'Bonus dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal hapus bonus', error: err.message });
  }
});

module.exports = router;
