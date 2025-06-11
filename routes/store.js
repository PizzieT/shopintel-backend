const express = require('express');
const router = express.Router();
const Store = require('../models/Store'); // Make sure Store model exists

// GET all stores
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find().sort({ createdAt: -1 });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new store
router.post('/', async (req, res) => {
  try {
    const store = new Store(req.body);
    await store.save();
    res.status(201).json(store);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;