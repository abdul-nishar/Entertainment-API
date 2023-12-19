const mongoose = require('mongoose');

const watchlistSchema = mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

watchlistSchema.index({ user: 1, entertainment: 1 });

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

module.exports = Watchlist;
