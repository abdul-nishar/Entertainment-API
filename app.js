/**
 * @fileoverview Main application file for setting up and configuring the Express app.
 * This file includes middleware setup, route handling, and global error handling.
 */

import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

import GlobalErrHandler from './controllers/errorController.js';
import AppError from './utils/appError.js';
// import cookieParser from 'cookie-parser';


// Routers
// import viewRouter from './routes/viewRoutes.js';
import entertainmentRouter from './routes/entertainmentRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import watchlistRouter from './routes/watchlistRoutes.js';

const app = express();

/**
 * Middleware setup
 */

// Sets security HTTP headers
app.use(helmet());

// Logging middleware for development environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiter middleware to prevent excessive requests from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser middleware to handle JSON payloads
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
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

/**
 * Route handlers
 */
// app.use('/', viewRouter);
app.use('/api/v1/entertainment', entertainmentRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/watchlist', watchlistRouter);

// Handle unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404));
});

/**
 * Global error handling middleware
 */
app.use(GlobalErrHandler);

export default app;