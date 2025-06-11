const express = require('express');
const mongoose = require('mongoose');
const storeRoutes = require('./storeRoutes'); // Adjust if your router file is named differently
require('dotenv').config(); // If you're using a .env file

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/stores', storeRoutes);

// MongoDB Connection (Optional: Add your MongoDB URI here)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/storesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
