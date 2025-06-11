const express = require('express');
const mongoose = require('mongoose');
const storeRoutes = require('./routes/store'); // Correct path to your router
require('dotenv').config(); // Loads environment variables from .env

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/stores', storeRoutes);

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/storesDB';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});