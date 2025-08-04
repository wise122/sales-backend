const express = require('express');
const router = express.Router();
const Diskon = require('../models/Diskon');

// GET semua diskon
router.get('/', async (req, res) => {
  try {
    const { segment } = req.query;
    const filter = segment ? { segment } : {};
    const data = await Diskon.find(filter);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil diskon', error: err.message });
  }
});

// POST tambah diskon
router.post('/', async (req, res) => {
  try {
    const diskon = new Diskon(req.body);
    await diskon.save();
    res.status(201).json({ message: 'Diskon ditambah', diskon });
  } catch (err) {
    res.status(400).json({ message: 'Gagal tambah diskon', error: err.message });
  }
});

// PUT update diskon
router.put('/:id', async (req, res) => {
  try {
    const updated = await Diskon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Diskon tidak ditemukan' });
    res.json({ message: 'Diskon diupdate', diskon: updated });
  } catch (err) {
    res.status(400).json({ message: 'Gagal update diskon', error: err.message });
  }
});

// DELETE hapus diskon
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Diskon.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Diskon tidak ditemukan' });
    res.json({ message: 'Diskon dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal hapus diskon', error: err.message });
  }
});

module.exports = router;
