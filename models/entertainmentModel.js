const mongoose = require('mongoose');

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
        message: 'Type must be either movie or series or anime or book.',
      },
      required: [true, 'Please select a type for the entertainment!'],
    },
    genre: {
      type: String,
      required: [true, `Please select a genre for the ${this.type}!`],
    },
    duration: {
      type: String,
      required: [true, `Please specify the duration of the ${this.type}!`],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, `Please summarize the ${this.type}`],
    },

    imageCover: {
      type: String,
      required: [true, `Please provide a cover image for the ${this.type}`],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    trailer: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

entertainmentSchema.index({ type: 1 });

// entertainmentSchema.index({ watchlist: true });

entertainmentSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'entertainment',
  localField: '_id',
});

// Document Middleware

entertainmentSchema.pre('save', function (next) {
  this.name =
    this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  next();
});

const Entertainment = mongoose.model('Entertainment', entertainmentSchema);

module.exports = Entertainment;
