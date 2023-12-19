const express = require('express');
const watchlistController = require('../controllers/watchlistController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
router
  .route('/')
  .get(watchlistController.getMyWatchlist)
  .post(watchlistController.addInWatchlist);

module.exports = router;
