var Topic = require('../models/topic');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;

exp.findById = function (req, res, next) {

  return Topic.findById(req.params.topicId);

};


exp.findByName = function (req, res, next) {

  // TODO

};


exp.findAll = function (req, res, next) {

  return Topic.find();
};


exp.addTopic = function (req, res, next) {

  var topic = new Topic();

  // TODO check if topic exists and un-delete it
  // TODO set case of topic (all lower?)
  topic.name = req.body.name;

  return topic.save();

};


exp.deleteTopic = function (req, res, next) {
  
  // TODO check if user is admin

  return Topic.update(
    { '_id': req.params.topicId },
    { $set: { 'deleted': true } }
  );

};
