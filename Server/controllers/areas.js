var Area = require('../models/area');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;

exp.findById = function (req, res, next) {
  var getArea = Area.findOne(
    { '_id': new ObjectId(req.params.areaId) }
  ).exec();

  getArea.addBack( function (err, area) {
    if (err) return next(err);
    res.json(area);
  });
};

exp.nextTenAreas = function (req, res, next) {
  Area.find()
  .sort({ 'title': 1})	// 1 is ascending and -1 is descending
  .skip(10*req.params.requestNumber)
  .limit(10)
  .exec( function (err, areas) {
    if(err) return next(err);
    res.json(areas)
  });
};

exp.retrieveAll = function (req, res, next) {
  var getAreas = Area.find().exec();

  getAreas.addBack( function (err, areas) {
    if (err) return next(err);
    res.json(areas);
  })
};

exp.addArea = function (req, res, next) {
  var area = new Area();
  area.title    = req.body.title;

  area.save( function (err, area) {
    if (err) return next(err);
    res.json(area)
  });
};

exp.updateArea = function (req, res, next) {
// TODO add auth info ensure only user and admin can update
	console.log(req.body);
  var updateArea = Area.update(
    { '_id': new ObjectId(req.params.areaId) },
    { $set: { 'title': req.body.title, 'dateModified': new Date() }}
  ).exec();

  updateArea.addBack( function (err, updated, raw) {
    if (err) return next(err);
    res.json(raw);
  });
};

exp.deleteArea = function (req, res, next) {
// TODO add auth info ensure only user and admin can delete
  var deleteArea = Area.find(
    { '_id': new ObjectId(req.params.areaId) }
  ).remove().exec();

  deleteArea.addBack( function (err, deleted) {
    if (err) return next(err);
    res.json(deleted);
  })
};
