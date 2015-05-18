var Topic = require('../models/topic');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;

exp.findById = function (req, res, next) {

  var getTopic = Topic.findOne(
    { '_id': new ObjectId(req.params.topicId) }
  ).exec();

  getTopic.addBack( function (err, topic) {
    if (err) return next(err);
    res.json(topic);
  });

};


exp.findByName = function (req, res, next) {

  // TODO

};


exp.findAll = function (req, res, next) {

  var getTopics = Topic.find().exec();

  getTopics.addBack( function (err, topics) {
    if (err) return next(err);
    res.json(topics);
  })

};


exp.addTopic = function (req, res, next) {

  var topic = new Topic();

  // TODO check if topic exists and un-delete it
  // TODO set case of topic (all lower?)
  topic.name = req.body.name;

  topic.save( function (err, topic) {
    if (err) return next(err);
    res.json(topic)
  });

};


exp.deleteTopic = function (req, res, next) {
  
  var deleteTopic = Topic.update(
    { '_id': req.params.topicId },
    { $set: { 'deleted': true } }
  ).exec();

  deleteTopic.addBack( function (err, updated, raw) {
    if (err) return next(err);
    res.json(raw);
  });

};
