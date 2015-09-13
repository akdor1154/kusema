var Group = require('../models/group');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;


exp.findById = function (req, res, next) {
  return Group.findById(req.params.groupId);
};

exp.findAll = function (req, res, next) {
  return Group.find();
};

exp.addGroup = function (req, res, next) {

  // TODO check if group exists and un-delete it

  var group = new Group();
  
  group.name   = req.body.name;
  group.topics = req.body.topics;

  return group.save();

};


exp.updateTopics = function (req, res, next) {
  
  // TODO add auth info ensure only mods and admin can update

  var topics = req.body.topics;

  return Group.findById(req.params.groupId)
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
  });

};


exp.deleteGroup = function (req, res, next) {
  
  // TODO add auth info ensure only mods and admin can delete

  return Group.update(
    { '_id': req.params.groupId },
    { $set: { 'deleted': true } }
  );

};
