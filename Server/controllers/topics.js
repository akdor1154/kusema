var Topic = require('../models/topic');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;

exp.findById = function (req, res, next) {

  Topic.findOne(
    { '_id': new ObjectId(req.params.topicId) }
  )
  .then( function (topic) {
    res.json(topic);
  })
  .catch(function(error) {
    return next(error)
  });

};


exp.findByName = function (req, res, next) {

  // TODO

};


exp.findAll = function (req, res, next) {

  Topic.find().exec()
  .then( function (topics) {
    res.mjson(topics);
  })
  .catch(function(error) {
    return next(error)
  });

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
  
  // TODO check if user is admin

  var deleteTopic = Topic.update(
    { '_id': req.params.topicId },
    { $set: { 'deleted': true } }
  ).exec();

  deleteTopic.addBack( function (err, updated, raw) {
    if (err) return next(err);
    res.json(raw);
  });

};
