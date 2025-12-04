const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Beach', 'Mountain', 'City', 'Adventure', 'Culture', 'Luxury'],
    required: true
  },
  days: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  oldPrice: {
    type: Number,
    default: null
  },
  currency: {
    type: String,
    default: 'USD'
  },
  description: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Tour+Image'
  },
  highlights: {
    type: [String],
    default: []
  },
  maxGroupSize: {
    type: Number,
    default: 30
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Hard'],
    default: 'Moderate'
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tour', tourSchema);
