// models/Marketplace.js

const mongoose = require('mongoose');

const MarketplaceSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  location: String,
  image: String,
});

module.exports = mongoose.model('Marketplace', MarketplaceSchema);
