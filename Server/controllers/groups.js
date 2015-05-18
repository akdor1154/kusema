var Group = require('../models/group');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;

exp.findById = function (req, res, next) {
  var getGroup = Group.findOne(
    { '_id': new ObjectId(req.params.groupId) }
  ).exec();

  getGroup.addBack( function (err, group) {
    if (err) return next(err);
    res.json(group);
  });
};

exp.nextTenGroups = function (req, res, next) {
  Group.find()
  .sort({ 'title': 1, 'code': -1 })	// 1 is ascending and -1 is descending
  .skip(10*req.params.requestNumber)
  .limit(10)
  .exec( function (err, groups) {
    if(err) return next(err);
    res.json(groups)
  });
};

exp.retrieveAll = function (req, res, next) {
  var getGroups = Group.find().exec();

  getGroups.addBack( function (err, groups) {
    if (err) return next(err);
    res.json(groups);
  })
};

exp.addGroup = function (req, res, next) {
  var group = new Group();
  
  group.name     = req.body.title;
  group.topics.  push(req.body.topics);

  group.save( function (err, group) {
    if (err) return next(err);
    res.json(group)
  });
};

exp.updateGroup = function (req, res, next) {
// TODO add auth info ensure only user and admin can update
	console.log(req.body);
  var updateGroup = Group.update(
    { '_id': new ObjectId(req.params.groupId) },
    { $set: { 'title': req.body.title, 'code': req.body.code, 'dateModified': new Date() }}
  ).exec();

  updateGroup.addBack( function (err, updated, raw) {
    if (err) return next(err);
    res.json(raw);
  });
};

exp.deleteGroup = function (req, res, next) {
// TODO add auth info ensure only user and admin can delete
  var deleteGroup = Group.find(
    { '_id': new ObjectId(req.params.groupId) }
  ).remove().exec();

  deleteGroup.addBack( function (err, deleted) {
    if (err) return next(err);
    res.json(deleted);
  })
};
