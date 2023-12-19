const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const GlobalErrHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
// const cookieParser = require('cookie-parser');

// Routers
const viewRouter = require('./routes/viewRoutes');
const entertainmentRouter = require('./routes/entertainmentRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const watchlistRouter = require('./routes/watchlistRoutes');

const app = express();

// Global Middlware

// Sets security HTTP headers
app.use(helmet());

// This middleware is responsible for logging HTTP requests and errors
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// This middleware is responsible for converting incoming JSON string into JSON objects
// Body parser, reading data from body to req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Http Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'name',
      'yearOfRelease',
      'imdbRating',
      'type',
      'genre',
      'duration',
      'rated',
    ],
  })
);

// Route Handlers
app.use('/', viewRouter);
app.use('/api/v1/entertainment', entertainmentRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/watchlist', watchlistRouter);

// Handling unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404));
});

// Global Error Handling Middleware
app.use(GlobalErrHandler);

module.exports = app;
