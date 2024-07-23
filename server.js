/**
 * @module server
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

/**
 * Handle uncaught exceptions globally.
 * Logs the error and shuts down the process.
 */
process.on('uncaughtException', (err) => {
  console.error(err.name, err.message);
  console.error('UNHANDLED EXCEPTION! 🔴 Shutting down...');
  process.exit(1);
});

// Load environment variables from the config file
dotenv.config({ path: './config.env' });

/**
 * Replace placeholder with the actual database password and connect to MongoDB.
 * Exits the process if there's a connection error.
 */
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('DB connection established...');
}).catch(err => {
  console.error('DB connection error:', err.message);
  process.exit(1);
});

import app from './app.js';

/**
 * Set the port for the server, default to 3000 if not specified.
 * Starts the server and logs the port it is listening on.
 */
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});

/**
 * Handle unhandled promise rejections globally.
 * Logs the error and shuts down the server gracefully.
 */
process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  console.error('UNHANDLED PROMISE REJECTION! 🔴 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});