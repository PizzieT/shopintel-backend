// === 1. BACKEND: server.js ===
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const scrapeStores = require('./scraper');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

const storeSchema = new mongoose.Schema({
  name: String,
  platform: String,
  domain: String,
  launchDate: String,
  country: String,
  email: String,
  checkoutEmail: String,
  niche: String,
  facebook: String,
  instagram: String,
  estimatedSales: String,
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);

app.get('/', (req, res) => {
  res.send('ShopIntel Backend is Live!');
});

app.get('/stores', async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stores', error });
  }
});

// Auto-run scraper every 12 hours
cron.schedule('0 */12 * * *', async () => {
  console.log('🕒 Running scheduled scraping job...');
  await scrapeStores();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
