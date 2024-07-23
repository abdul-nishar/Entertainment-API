/**
 * A higher-order function that wraps an asynchronous route handler to catch any errors and pass them to the next middleware.
 *
 * @param {Function} fn - The asynchronous route handler function to be wrapped.
 * @returns {Function} - A middleware function that catches errors and forwards them to the next middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;