/**
 * Custom error class for handling application-specific errors.
 * Inherits from the built-in Error class.
 */
export default class AppError extends Error {
  /**
   * Creates an instance of AppError.
   * 
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code representing the error.
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Creates a .stack property on 'this', which, when accessed, returns a string representing the location in the code at which Error.captureStackTrace() was called.
    Error.captureStackTrace(this, this.constructor);
  }
}