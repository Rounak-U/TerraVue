const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: String,
  country: String,
  days: Number,
  price: Number,
  oldPrice: Number,
  currency: String,
  description: String
  // No `image` here — handled in frontend
});

module.exports = mongoose.model('Tour', tourSchema);
