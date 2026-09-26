require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const app = require('../src/app');

// Top-level connection promise for cold starts
let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected && process.env.MONGO_URI) {
    await connectDB(process.env.MONGO_URI);
    isConnected = true;
  }
  
  // Forward the request to the Express app
  return app(req, res);
};
