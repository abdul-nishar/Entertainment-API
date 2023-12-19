const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  entertainment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entertainment',
    required: [true, 'Review must belong to some entertainment'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to some user'],
  },
  review: {
    type: String,
    required: [true, 'Review cannot be empty'],
  },
  rating: {
    type: Number,
    required: [true, 'Review must have a rating.'],
    min: [1, 'Rating must be between 1 and 5'],
    max: [5, 'Rating must be between 1 and 5'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

reviewSchema.index({ entertainment: -1, user: -1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
