import Entertainment from '../models/entertainmentModel.js';
import * as factory from './handlerFactory.js';

/**
 * Retrieves all entertainment records.
 * @type {Function}
 */
export const getAllEntertainment = factory.getAll(Entertainment);

/**
 * Creates a new entertainment record.
 * @type {Function}
 */
export const createEntertainment = factory.createOne(Entertainment);

/**
 * Retrieves a single entertainment record by ID, including related reviews.
 * @type {Function}
 */
export const getEntertainment = factory.getOne(Entertainment, { path: 'reviews' });

/**
 * Deletes a single entertainment record by ID.
 * @type {Function}
 */
export const deleteEntertainment = factory.deleteOne(Entertainment);

/**
 * Updates a single entertainment record by ID.
 * @type {Function}
 */
export const updateEntertainment = factory.updateOne(Entertainment);