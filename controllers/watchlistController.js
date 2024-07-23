import * as factory from './handlerFactory.js';
import Watchlist from '../models/watchlistModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

/**
 * Retrieves all watchlist items for the currently authenticated user.
 * @type {Function}
 */
export const getMyWatchlist = factory.getAll(Watchlist);

/**
 * Adds a new item to the watchlist for the currently authenticated user.
 * @type {Function}
 */
export const addInWatchlist = catchAsync(async (req, res, next) => {
    const user = req.user._id;

    const existingDoc = await Watchlist.findOne({...req.body, user});

    if (existingDoc) {
      return next(new AppError('A similar document already exists in the watchlist.', 400));
    }

    // Create the document with userId and data from req.body
    const doc = await Watchlist.create({ ...req.body, user });

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

export const removeFromWatchlist = factory.deleteOne(Watchlist);