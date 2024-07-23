import express from 'express';
import reviewRouter from './reviewRoutes.js';
import * as entertainmentController from '../controllers/entertainmentController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

/**
 * Route to handle requests for entertainment resources.
 * @module entertainmentRoutes
 */

/**
 * @route GET /api/v1/entertainment
 * @desc Get all entertainment items
 * @access Public
 */
router.get('/', entertainmentController.getAllEntertainment);

/**
 * @route GET /api/v1/entertainment/:id
 * @desc Get a specific entertainment item by ID
 * @access Public
 * @param {string} id - The ID of the entertainment item
 */
router.get('/:id', entertainmentController.getEntertainment);

/**
 * @route /api/v1/entertainment/:entertainmentId/reviews
 * @desc Gets reviews for the specified entertainment ID
 * @access Public

 * @param {string} entertainmentId - The ID of the entertainment item
 */
router.use('/:entertainmentId/reviews', reviewRouter);

/**
 * @route POST /api/v1/entertainment
 * @desc Create a new entertainment item
 * @access Private
 */
router.post('/', protect, entertainmentController.createEntertainment);

/**
 * @route PATCH /api/v1/entertainment/:id
 * @desc Update a specific entertainment item by ID
 * @access Admin
 * @param {string} id - The ID of the entertainment item
 */
router.patch('/:id', protect, entertainmentController.updateEntertainment);

/**
 * @route DELETE /api/v1/entertainment/:id
 * @desc Delete a specific entertainment item by ID
 * @access Admin
 * @param {string} id - The ID of the entertainment item
 */
router.delete('/:id', protect, entertainmentController.deleteEntertainment);

export default router;