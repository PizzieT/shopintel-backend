const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: String,
  domain: String,
  platform: String,
  description: String,
  category: String
});

module.exports = mongoose.model('Store', storeSchema);
