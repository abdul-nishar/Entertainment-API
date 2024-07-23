import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import User from '../models/userModel.js';
import Entertainment from '../models/entertainmentModel.js';
import Review from '../models/reviewModel.js';

dotenv.config({ path: './config.env' });

// Database connection
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Database connection established...'))
  .catch(err => console.error('Database connection error:', err));

// Load data from JSON files
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const entertainments = JSON.parse(fs.readFileSync(`${__dirname}/entertainment.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

/**
 * Import data into the database.
 * @async
 * @function
 */
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Entertainment.create(entertainments);
    await Review.create(reviews);
    console.log('Data imported successfully!!');
  } catch (error) {
    console.error('Data import error:', error);
  }
};

/**
 * Delete all data from the database.
 * @async
 * @function
 */
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Entertainment.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted successfully!!');
  } catch (error) {
    console.error('Data deletion error:', error);
  }
};

// Command line argument processing
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}