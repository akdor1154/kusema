var Group = require('../models/group');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;


exp.findById = function (req, res, next) {
  Group.findById(req.params.groupId)
  .then( res.json )
  .catch( next );
};

exp.findAll = function (req, res, next) {
  Group.find()
  .then( res.mjson )
  .catch( next );
};

exp.addGroup = function (req, res, next) {

  // TODO check if group exists and un-delete it

  var group = new Group();
  
  group.name   = req.body.name;
  group.topics = req.body.topics;

  group.save()
  .then( res.json )
  .error( next );

};


exp.updateTopics = function (req, res, next) {
  
  // TODO add auth info ensure only mods and admin can update

  var topics = req.body.topics;

  var updateTopics = Group.findOne(
    { '_id': req.params.groupId }
  ).exec();

  Group.findById(req.params.groupId)
  .then( function(group) {
    if (group) {
      for (var i in topics) {
        if (group.topics.indexOf(topics[i]) === -1) {
          group.topics.push(topics[i]);
        }  
      }
      return group.save();
    } else {
      return group;
    }
  })
  .then( res.json )
  .catch( next);

};


exp.deleteGroup = function (req, res, next) {
  
  // TODO add auth info ensure only mods and admin can delete

  var deleteGroup = Group.update(
    { '_id': req.params.groupId },
    { $set: { 'deleted': true } }
  )
  .then( res.json )
  .catch( next );

};
