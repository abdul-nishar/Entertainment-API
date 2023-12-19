const express = require('express');
const reviewRouter = require('./reviewRoutes.js');
const entertainmentController = require('../controllers/entertainmentController');

const router = express.Router();

router
  .route('/')
  .get(entertainmentController.getAllEntertainment)
  .post(entertainmentController.createEntertainment);

router
  .route('/:id')
  .get(entertainmentController.getEntertainment)
  .patch(entertainmentController.updateEntertainment)
  .delete(entertainmentController.deleteEntertainment);

router.use('/:entertainmentId/reviews', reviewRouter);

module.exports = router;
