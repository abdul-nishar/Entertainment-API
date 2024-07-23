import express from 'express';
import * as watchlistController from '../controllers/watchlistController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

/**
 * Route to handle user watchlist operations.
 * @module watchlistRoutes
 */

/**
 * Middleware to protect all routes in this router.
 * @middleware authController.protect
 */
router.use(authController.protect);

/**
 * @route GET /api/v1/watchlist
 * @desc Get the current user's watchlist
 * @access Private
 */
router.get('/', watchlistController.getMyWatchlist);

/**
 * @route POST /api/v1/watchlist
 * @desc Add an item to the current user's watchlist
 * @access Private
 */
router.post('/', watchlistController.addInWatchlist);

/**
 * @route GET /api/v1/watchlist/:id
 * @desc Removes an item from the current user's watchlist
 * @access Private
 */
router.delete('/:id', watchlistController.removeFromWatchlist);

export default router;