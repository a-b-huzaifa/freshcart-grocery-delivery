require('dotenv').config({ quiet: true });
const app = require('../src/app');
const connectDB = require('../src/config/db');
const mongoose = require('mongoose');

// Vercel serverless functions reuse the same Node container across multiple requests when possible.
// We should check if we already have an active database connection.
app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1 && process.env.MONGO_URI) {
      await connectDB(process.env.MONGO_URI);
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = app;
