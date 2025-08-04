const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET semua produk
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil produk', error: err });
  }
});

// POST tambah produk
router.post('/', async (req, res) => {
  const {
    code, name, hpp, stokAwalTotal, stokAwalSales,
    hargaRetail, hargaWS, hargaAgen, stokAkhirSales, totalStokAkhir
  } = req.body;

  try {
    const newProduct = new Product({
      code, name, hpp, stokAwalTotal, stokAwalSales,
      hargaRetail, hargaWS, hargaAgen, stokAkhirSales, totalStokAkhir
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: 'Gagal menambah produk', error: err });
  }
});

// DELETE produk (opsional)
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produk dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus produk', error: err });
  }
});

module.exports = router;
