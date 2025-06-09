require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Store = require('./models/Store'); // ✅ Use your external model file

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err.message));

// Routes
app.get('/', (req, res) => {
  res.send('ShopIntel Backend is Live!');
});
// TEMP: Add a dummy store for testing
Store.findOne({ domain: 'testshop.myshopify.com' })
  .then(existing => {
    if (!existing) {
      return Store.create({
        name: 'Test Store',
        domain: 'testshop.myshopify.com',
        platform: 'Shopify'
      });
    } else {
      console.log('Dummy store already exists.');
    }
  })
  .then(() => {
    console.log('Dummy store inserted (or already present).');
  })
  .catch(err => console.error('Error inserting dummy store:', err));

// /stores route
app.get('/stores', async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stores', error });
  }
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 console.log(`🚀 Server is running on port ${PORT}`);
});
