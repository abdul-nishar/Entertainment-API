import mongoose from 'mongoose';

/**
 * Schema for storing user watchlists.
 * @typedef {Object} Watchlist
 * @property {mongoose.Schema.Types.ObjectId} entertainment - The ID of the entertainment item added to the watchlist.
 * @property {mongoose.Schema.Types.ObjectId} user - The ID of the user who added the entertainment to the watchlist.
 * @property {Date} createdAt - The date when the item was added to the watchlist.
 */

const watchlistSchema = new mongoose.Schema({
  entertainment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entertainment',
    required: [true, 'Entertainment must be selected for watchlist'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User must be selected for watchlist'],
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a unique index for combinations of user and entertainment
watchlistSchema.index({ user: 1, entertainment: 1 }, { unique: true });

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

export default Watchlist;