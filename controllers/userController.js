import User from '../models/userModel.js';
import * as factory from './handlerFactory.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * Filters an object to include only allowed fields.
 * @param {Object} obj - The object to be filtered.
 * @param {...string} allowedFields - The fields to include in the filtered object.
 * @returns {Object} - The filtered object with only allowed fields.
 */
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

/**
 * Updates the currently logged-in user's profile with allowed fields.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {AppError} If the request body contains password fields.
 */
export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword',
        401
      )
    );
  }

  const filterBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

/**
 * Marks the currently logged-in user as inactive (soft delete).
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/**
 * Retrieves all users using the factory method.
 * @type {Function}
 */
export const getAllUsers = factory.getAll(User);

/**
 * Retrieves a single user by ID using the factory method.
 * @type {Function}
 */
export const getUser = factory.getOne(User);

/**
 * Creates a new user using the factory method.
 * @type {Function}
 */
export const createUser = factory.createOne(User);

/**
 * Updates an existing user by ID using the factory method.
 * @type {Function}
 */
export const updateUser = factory.updateOne(User);

/**
 * Deletes a user by ID using the factory method.
 * @type {Function}
 */
export const deleteUser = factory.deleteOne(User);