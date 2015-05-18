var Topic = require('../models/topic');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;

exp.findById = function (req, res, next) {
  var getTopic = Topic.findOne(
    { '_id': new ObjectId(req.params.areaId) }
  ).exec();

  getTopic.addBack( function (err, area) {
    if (err) return next(err);
    res.json(area);
  });
};

exp.nextTenTopics = function (req, res, next) {
  Topic.find()
  .sort({ 'title': 1})	// 1 is ascending and -1 is descending
  .skip(10*req.params.requestNumber)
  .limit(10)
  .exec( function (err, areas) {
    if(err) return next(err);
    res.json(areas)
  });
};

exp.retrieveAll = function (req, res, next) {
  var getTopics = Topic.find().exec();

  getTopics.addBack( function (err, areas) {
    if (err) return next(err);
    res.json(areas);
  })
};

exp.addTopic = function (req, res, next) {
  var area = new Topic();
  area.title    = req.body.title;

  area.save( function (err, area) {
    if (err) return next(err);
    res.json(area)
  });
};

exp.updateTopic = function (req, res, next) {
// TODO add auth info ensure only user and admin can update
	console.log(req.body);
  var updateTopic = Topic.update(
    { '_id': new ObjectId(req.params.areaId) },
    { $set: { 'title': req.body.title, 'dateModified': new Date() }}
  ).exec();

  updateTopic.addBack( function (err, updated, raw) {
    if (err) return next(err);
    res.json(raw);
  });
};

exp.deleteTopic = function (req, res, next) {
// TODO add auth info ensure only user and admin can delete
  var deleteTopic = Topic.find(
    { '_id': new ObjectId(req.params.areaId) }
  ).remove().exec();

  deleteTopic.addBack( function (err, deleted) {
    if (err) return next(err);
    res.json(deleted);
  })
};
