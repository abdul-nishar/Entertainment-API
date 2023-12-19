const factory = require('./handlerFactory');
const Watchlist = require('../models/watchlistModel');

exports.getMyWatchlist = factory.getAll(Watchlist);

exports.addInWatchlist = factory.createOne(Watchlist);
