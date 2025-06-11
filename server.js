const express = require('express');
const mongoose = require('mongoose');
const storeRoutes = require('./routes/store');
require('dotenv').config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/stores', storeRoutes);

// MongoDB connection
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined in environment variables.');
}

mongoose.connect(process.env.MONGO_URI, {
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