const Entertainment = require('../models/entertainmentModel');
const factory = require('./handlerFactory');

exports.getAllEntertainment = factory.getAll(Entertainment);

exports.createEntertainment = factory.createOne(Entertainment);

exports.getEntertainment = factory.getOne(Entertainment, { path: 'reviews' });

exports.deleteEntertainment = factory.deleteOne(Entertainment);

exports.updateEntertainment = factory.updateOne(Entertainment);
