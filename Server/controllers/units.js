var Unit = require('../models/unit');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;

exp.findById = function (req, res, next) {
  var getUnit = Unit.findOne(
    { '_id': new ObjectId(req.params.unitId) }
  ).exec();

  getUnit.addBack( function (err, unit) {
    if (err) return next(err);
    res.json(unit);
  });
};

exp.nextTenUnits = function (req, res, next) {
  Unit.find()
  .sort({ 'title': 1, 'code': -1 })	// 1 is ascending and -1 is descending
  .skip(10*req.params.requestNumber)
  .limit(10)
  .exec( function (err, units) {
    if(err) return next(err);
    res.json(units)
  });
};

exp.retrieveAll = function (req, res, next) {
  var getUnits = Unit.find().exec();

  getUnits.addBack( function (err, units) {
    if (err) return next(err);
    res.json(units);
  })
};

exp.addUnit = function (req, res, next) {
  var unit = new Unit();
  unit.title    = req.body.title;
  unit.code  = req.body.code;

  unit.save( function (err, unit) {
    if (err) return next(err);
    res.json(unit)
  });
};

exp.updateUnit = function (req, res, next) {
// TODO add auth info ensure only user and admin can update
	console.log(req.body);
  var updateUnit = Unit.update(
    { '_id': new ObjectId(req.params.unitId) },
    { $set: { 'title': req.body.title, 'code': req.body.code, 'dateModified': new Date() }}
  ).exec();

  updateUnit.addBack( function (err, updated, raw) {
    if (err) return next(err);
    res.json(raw);
  });
};

exp.deleteUnit = function (req, res, next) {
// TODO add auth info ensure only user and admin can delete
  var deleteUnit = Unit.find(
    { '_id': new ObjectId(req.params.unitId) }
  ).remove().exec();

  deleteUnit.addBack( function (err, deleted) {
    if (err) return next(err);
    res.json(deleted);
  })
};
