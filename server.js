const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Safety net for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED EXCEPTION! 🔴 Shutting down...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('DB connection established...');
});

const app = require('./app');

const port = 3000 || process.env.PORT;

const server = app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});

// Safety net for unhandled rejected promises
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED PROMISE REJECTION! 🔴 Shutting down...');
  // server.close waits for the pending requests to complete before exiting the application
  server.close(() => {
    process.exit(1);
  });
});
