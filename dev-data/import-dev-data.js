const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const Entertainment = require('../models/entertainmentModel');
const Review = require('../models/reviewModel');
const fs = require('fs');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('Database connection established...');
});

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const entertainments = JSON.parse(
  fs.readFileSync(`${__dirname}/entertainment.json`, 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Entertainment.create(entertainments);
    await Review.create(reviews);
    console.log('Data imported successfully!!');
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Entertainment.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted successfully!!');
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] == '--import') {
  importData();
} else if (process.argv[2] == '--delete') {
  deleteData();
}
