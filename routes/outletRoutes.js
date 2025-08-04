const express = require('express');
const router = express.Router();
const Outlet = require('../models/Outlet');

// ✅ POST - Simpan outlet baru
router.post('/', async (req, res) => {
  try {
    console.log('[POST] Received outlet data:', req.body);

    const {
      id,
      name,
      owner,
      address,
      latitude,
      longitude,
      photoPath,
      ktpPhotoPath,
      segment
    } = req.body;

    if (!id || !name || !owner || !address || latitude == null || longitude == null || !photoPath || !ktpPhotoPath) {
      console.warn('[POST] Data tidak lengkap:', req.body);
      return res.status(400).json({ message: 'Data outlet tidak lengkap' });
    }

    const newOutlet = new Outlet({
      id,
      name,
      owner,
      address,
      latitude,
      longitude,
      photoPath,
      ktpPhotoPath,
      segment
    });

    console.log('[POST] Saving outlet:', newOutlet);

    await newOutlet.save();

    console.log('[POST] Outlet saved successfully:', newOutlet);

    res.status(201).json({ message: 'Outlet berhasil disimpan', outlet: newOutlet });
  } catch (error) {
    console.error('[POST] Save outlet error:', error);
    res.status(500).json({ message: 'Gagal menyimpan outlet', error: error.message });
  }
});

// ✅ GET - Ambil semua outlet atau filter by segment
router.get('/', async (req, res) => {
  try {
    const { segment } = req.query;
    let query = {};

    if (segment) {
      query.segment = new RegExp(`^${segment}$`, 'i'); // case insensitive
    }

    console.log('[GET] Querying with:', query);

    const outlets = await Outlet.find(query);

    console.log(`[GET] Found ${outlets.length} outlet(s)`);

    res.json(outlets);
  } catch (error) {
    console.error('[GET] Get outlet error:', error);
    res.status(500).json({ message: 'Gagal mengambil data outlet', error: error.message });
  }
});

// ✅ GET - Ambil outlet berdasarkan ID
router.get('/:id', async (req, res) => {
  try {
    console.log('[GET by ID] Searching for:', req.params.id);

    const outlet = await Outlet.findOne({ id: req.params.id });

    if (!outlet) {
      console.warn('[GET by ID] Not found:', req.params.id);
      return res.status(404).json({ message: 'Outlet tidak ditemukan' });
    }

    console.log('[GET by ID] Found:', outlet);

    res.json(outlet);
  } catch (error) {
    console.error('[GET by ID] Error:', error);
    res.status(500).json({ message: 'Gagal mengambil data outlet', error: error.message });
  }
});

// ✅ PUT - Update outlet
router.put('/:id', async (req, res) => {
  try {
    console.log('[PUT] Update request for:', req.params.id, 'with:', req.body);

    const updated = await Outlet.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      console.warn('[PUT] Not found:', req.params.id);
      return res.status(404).json({ message: 'Outlet tidak ditemukan' });
    }

    console.log('[PUT] Updated:', updated);

    res.json({ message: 'Outlet berhasil diupdate', outlet: updated });
  } catch (error) {
    console.error('[PUT] Update outlet error:', error);
    res.status(500).json({ message: 'Gagal update outlet', error: error.message });
  }
});

// ✅ DELETE - Hapus outlet
router.delete('/:id', async (req, res) => {
  try {
    console.log('[DELETE] Deleting:', req.params.id);

    const deleted = await Outlet.findOneAndDelete({ id: req.params.id });

    if (!deleted) {
      console.warn('[DELETE] Not found:', req.params.id);
      return res.status(404).json({ message: 'Outlet tidak ditemukan' });
    }

    console.log('[DELETE] Deleted:', deleted);

    res.json({ message: 'Outlet berhasil dihapus' });
  } catch (error) {
    console.error('[DELETE] Delete outlet error:', error);
    res.status(500).json({ message: 'Gagal menghapus outlet', error: error.message });
  }
});

module.exports = router;
