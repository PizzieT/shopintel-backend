const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: String,
  platform: String,
  domain: String,
  launchDate: Date,
  country: String,
  email: String,
  checkoutEmail: String,
  niche: String,
  facebook: String,
  instagram: String,
  estimatedSales: Number,
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);