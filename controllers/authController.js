import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * Creates a JWT token for a given user ID.
 * @param {string} id - The user ID to include in the token payload.
 * @returns {string} - The signed JWT token.
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_COOKIE_EXPIRY_TIME,
  });
};

/**
 * Creates and sends a JWT token as a cookie and user data in the response.
 * @param {Object} user - The user object to send in the response.
 * @param {number} statusCode - The HTTP status code for the response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const createSendToken = (user, statusCode, req, res) => {
  // Create a token
  const token = signToken(user._id);

  // Convert cookie expiry time to milliseconds
  const expiresInMS = parseInt(process.env.JWT_COOKIE_EXPIRY_TIME, 10) * 1000;

  // Set cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + expiresInMS),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production',
  };

  // Send the token as a cookie
  res.cookie('jwt', token, cookieOptions);

  // Hide user password from response
  user.password = undefined;

  // Send response with token and user data
  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};

/**
 * Logs in a user by verifying their email and password, then creates and sends a JWT token.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {AppError} - Throws an error if email or password is missing, or if authentication fails.
 */
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please enter email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.passwordVerification(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  createSendToken(user, 200, req, res);
});

/**
 * Signs up a new user and sends a JWT token as a response.
 * @param {Object} req - The request object containing user data.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, req, res);
});

/**
 * Logs out a user by clearing the JWT token cookie.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expiresIn: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

/**
 * Middleware to protect routes by verifying the JWT token and setting `req.user`.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {AppError} - Throws an error if token is missing, invalid, or user has changed password.
 */
export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt && req.cookies.jwt !== 'loggedout') {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to access this.', 401));
  }

  try{
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('User to whom this token belongs no longer exists', 401));
    }

    if (currentUser.passwordChanged(decoded.iat)) {
      return next(new AppError('User recently changed password. Please log in again.', 401));
    }

    req.user = currentUser;
    next();
  }catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log(`Token expired at: ${err.expiredAt}`);
      return next(new AppError('Token expired, please log in again.', 401));
    }
    return next(new AppError('Invalid token.', 401));
  }
});

/**
 * Middleware to restrict access to certain roles.
 * @param {...string} roles - The roles that are allowed to access the route.
 * @returns {Function} - Middleware function to restrict access based on roles.
 * @throws {AppError} - Throws an error if user does not have permission.
 */
export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to perform this action.', 403));
  }
  next();
};

/**
 * Sends a password reset token to the user's email.
 * @param {Object} req - The request object containing the user's email.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {AppError} - Throws an error if no user is found or if there is an issue sending the email.
 */
export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with this email address', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    console.log(resetUrl);
    res.status(200).json({
      status: 'success',
      message: 'Password reset token has been sent to your email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Please try later.', 500));
  }
});

/**
 * Resets the user's password using the provided token and new password.
 * @param {Object} req - The request object containing the reset token and new password.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {AppError} - Throws an error if the token is invalid or has expired.
 */
export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  createSendToken(user, 201, req, res);
});

/**
 * Updates the user's password.
 * @param {Object} req - The request object containing the current and new passwords.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {AppError} - Throws an error if the current password is incorrect.
 */
export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!user || !(await user.passwordVerification(req.body.currentPassword, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  createSendToken(user, 201, req, res);
});