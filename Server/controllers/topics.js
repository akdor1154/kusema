var Topic = require('../models/topic');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;

exp.findById = function (req, res, next) {

  Topic.findById(req.params.topicId)
  .then( res.json )
  .catch( next );

};


exp.findByName = function (req, res, next) {

  // TODO

};


exp.findAll = function (req, res, next) {

  Topic.find()
  .then( res.mjson )
  .catch( next );
};


exp.addTopic = function (req, res, next) {

  var topic = new Topic();

  // TODO check if topic exists and un-delete it
  // TODO set case of topic (all lower?)
  topic.name = req.body.name;

  topic.save()
  .then( res.json )
  .catch( next );

};


exp.deleteTopic = function (req, res, next) {
  
  // TODO check if user is admin

  Topic.update(
    { '_id': req.params.topicId },
    { $set: { 'deleted': true } }
  )
  .then( res.json )
  .catch( next );

};
