import APIFeatures from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * Handles GET requests to retrieve a list of documents from the given model.
 * Supports filtering, sorting, field selection, and pagination using API features.
 * @param {Object} Model - The Mongoose model to query.
 * @returns {Function} - Middleware function.
 */
export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};

    if (req.params.entertainmentId) {
      filter = { entertainment: req.params.entertainmentId };
    }

    // Using API features
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .fieldSelection()
      .paginate();

    // Getting the data from the query field of the API features class
    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: docs,
    });
  });

/**
 * Handles POST requests to create a new document in the given model.
 * @param {Object} Model - The Mongoose model to use for creating the document.
 * @returns {Function} - Middleware function.
 */
export const createOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

/**
 * Handles GET requests to retrieve a single document from the given model by ID.
 * Optionally populates fields based on provided options.
 * @param {Object} Model - The Mongoose model to query.
 * @param {Object} [popOptions] - Optional populate options for Mongoose.
 * @returns {Function} - Middleware function.
 */
export const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) {
      query = query.populate(popOptions);
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

/**
 * Handles DELETE requests to remove a document from the given model by ID.
 * @param {Object} Model - The Mongoose model to use for deleting the document.
 * @returns {Function} - Middleware function.
 */
export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with this ID', 404));
    }

    res.status(204).json({
      status: 'success',
    });
  });

/**
 * Handles PATCH requests to update a document in the given model by ID.
 * @param {Object} Model - The Mongoose model to use for updating the document.
 * @returns {Function} - Middleware function.
 */
export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });