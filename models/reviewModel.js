import mongoose from 'mongoose';

/**
 * Schema for storing reviews of entertainment items.
 * @typedef {Object} Review
 * @property {mongoose.Schema.Types.ObjectId} entertainment - The ID of the entertainment item being reviewed.
 * @property {mongoose.Schema.Types.ObjectId} user - The ID of the user who wrote the review.
 * @property {string} review - The text content of the review.
 * @property {number} rating - The rating given in the review, between 1 and 5.
 * @property {Date} createdAt - The date when the review was created.
 */

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
    default: Date.now,
  },
});

// Create a unique index for combinations of entertainment and user to prevent duplicate reviews
reviewSchema.index({ entertainment: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;