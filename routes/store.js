const express = require('express');
const router = express.Router();
const Store = require('./models/Store');

// GET: All stores (supports filters via query)
router.get('/', async (req, res) => {
  try {
    const filters = {};

    if (req.query.country) filters.country = req.query.country;
    if (req.query.platform) filters.platform = req.query.platform;
    if (req.query.niche) filters.niche = req.query.niche;
    if (req.query.minSales) filters.estimatedSales = { $gte: Number(req.query.minSales) };
    if (req.query.launchAfter) filters.launchDate = { $gte: new Date(req.query.launchAfter) };

    const stores = await Store.find(filters).sort({ launchDate: -1 });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get stores', error });
  }
});

// POST: Add new store
router.post('/', async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json(store);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create store', error });
  }
});

module.exports = router;
