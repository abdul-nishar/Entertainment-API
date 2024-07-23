import mongoose from 'mongoose';

/**
 * Schema for storing entertainment information.
 * @typedef {Object} Entertainment
 * @property {string} name - The name of the entertainment item.
 * @property {string} yearOfRelease - The year the entertainment item was released.
 * @property {string} rated - The rating of the entertainment item.
 * @property {string} director - The director of the entertainment item.
 * @property {string} writer - The writer of the entertainment item.
 * @property {string} actors - The actors in the entertainment item.
 * @property {string} imdbRating - The IMDb rating of the entertainment item.
 * @property {string} totalSeasons - The total number of seasons (for series).
 * @property {('movie' | 'series' | 'anime' | 'book')} type - The type of entertainment (movie, series, anime, or book).
 * @property {string} genre - The genre of the entertainment item.
 * @property {string} duration - The duration of the entertainment item.
 * @property {string} summary - A summary of the entertainment item.
 * @property {string} imageCover - The cover image for the entertainment item.
 * @property {string[]} images - Array of image URLs related to the entertainment item.
 * @property {Date} createdAt - The date the entertainment item was created.
 * @property {string} trailer - URL to the trailer for the entertainment item.
 */

const entertainmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the entertainment!'],
      trim: true,
      unique: true,
    },
    yearOfRelease: String,
    rated: String,
    director: String,
    writer: String,
    actors: String,
    imdbRating: String,
    totalSeasons: String,
    type: {
      type: String,
      enum: {
        values: ['movie', 'series', 'anime', 'book'],
        message: 'Type must be either movie, series, anime, or book.',
      },
      required: [true, 'Please select a type for the entertainment!'],
    },
    genre: {
      type: String,
      required: [true, function() { return `Please select a genre for the ${this.type}!`; }],
    },
    duration: {
      type: String,
      required: [true, function() { return `Please specify the duration of the ${this.type}!`; }],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, function() { return `Please summarize the ${this.type}`; }],
    },
    imageCover: {
      type: String,
      required: [true, function() { return `Please provide a cover image for the ${this.type}`; }],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    trailer: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for querying by type
entertainmentSchema.index({ type: 1 });

// entertainmentSchema.index({ watchlist: true });

// Virtual property for reviews
entertainmentSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'entertainment',
  localField: '_id',
});

// Document Middleware

/**
 * Middleware to format the name field before saving the document.
 * Capitalizes the first letter and lowercases the rest of the name.
 * @param {Function} next - Callback function to signal completion of the middleware.
 */
entertainmentSchema.pre('save', function(next) {
  this.name =
    this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  next();
});

const Entertainment = mongoose.model('Entertainment', entertainmentSchema);

export default Entertainment;