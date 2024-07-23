import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

/**
 * Route to handle requests for reviews.
 * @module reviewRoutes
 */

/**
 * @route GET /api/v1/reviews
 * @desc Get all reviews
 * @access Admin
 */
router.get('/', reviewController.getAllReviews);

/**
 * @route POST /api/v1/reviews
 * @desc Create a new review
 * @access Private
 */
router.post('/', reviewController.createReview);

/**
 * @route GET /api/v1/reviews/:id
 * @desc Get a specific review by ID
 * @access Admin
 * @param {string} id - The ID of the review
 */
router.get('/:id', reviewController.getReview);

/**
 * @route PATCH /api/v1/reviews/:id
 * @desc Update a specific review by ID
 * @access Admin 
 * @param {string} id - The ID of the review
 */
router.patch('/:id', reviewController.updateReview);

/**
 * @route DELETE /api/v1/reviews/:id
 * @desc Delete a specific review by ID
 * @access Admin
 * @param {string} id - The ID of the review
 */
router.delete('/:id', reviewController.deleteReview);

export default router;