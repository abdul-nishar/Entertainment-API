import * as factory from './handlerFactory.js';
import Review from '../models/reviewModel.js';

/**
 * Retrieves all reviews using the factory method.
 * @type {Function}
 */
export const getAllReviews = factory.getAll(Review);

/**
 * Creates a new review using the factory method.
 * @type {Function}
 */
export const createReview = factory.createOne(Review);

/**
 * Retrieves a single review by ID using the factory method.
 * @type {Function}
 */
export const getReview = factory.getOne(Review);

/**
 * Updates an existing review by ID using the factory method.
 * @type {Function}
 */
export const updateReview = factory.updateOne(Review);

/**
 * Deletes a review by ID using the factory method.
 * @type {Function}
 */
export const deleteReview = factory.deleteOne(Review);