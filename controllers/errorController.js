import AppError from '../utils/appError.js';

/**
 * Handles database CastError and returns a formatted AppError.
 * @param {Object} err - The error object.
 * @returns {AppError} - Formatted AppError instance.
 */
const handleCastErrorDB = (err) =>
  new AppError(`Invalid ${err.path} : ${err.value}`, 400);

/**
 * Handles duplicate field value errors and returns a formatted AppError.
 * @param {Object} err - The error object.
 * @returns {AppError} - Formatted AppError instance.
 */
const handleDuplicateNameFieldErrorDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value.`;
  return new AppError(message, 400);
};

/**
 * Handles validation errors and returns a formatted AppError.
 * @param {Object} err - The error object.
 * @returns {AppError} - Formatted AppError instance.
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(' ')}`;
  return new AppError(message, 400);
};

/**
 * Handles JWT errors and returns a formatted AppError.
 * @returns {AppError} - Formatted AppError instance.
 */
const handleJWTError = () =>
  new AppError('Invalid token, please login again', 401);

/**
 * Handles expired token errors and returns a formatted AppError.
 * @returns {AppError} - Formatted AppError instance.
 */
const handleTokenExpiredError = () =>
  new AppError('Your session is expired. Please login again.', 401);

/**
 * Sends error response in development mode.
 * @param {Object} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const sendErrDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  // Render error page for non-API requests in development
  // res.status(err.statusCode).render('error', {
  //   title: 'Something went wrong!',
  //   msg: err.message,
  // });
};

/**
 * Sends error response in production mode.
 * @param {Object} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const sendErrProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // Operational/Trusted Errors: Send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming or other unknown error: don't leak error information to client
    console.log('ERROR ❗️');

    // Send generic message to client
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
  
  // Operational/Trusted Errors: Send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  
  // Programming or other unknown error: don't leak error information to client
  console.log('ERROR ❗️');

  // Send generic message to client
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later',
  });
};

/**
 * Global error handling middleware.
 * @param {Object} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateNameFieldErrorDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleTokenExpiredError();

    sendErrProd(error, req, res);
  }
};