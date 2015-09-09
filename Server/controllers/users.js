var User = require('../models/user');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;

exp.findUserById = function (req, res, next) {
  return User.findById(req.params.userId);
};

exp.findUserByUsername = function (req, res, next) {
  return User.findOne(
    { 'local.username': req.body.username }
  );
};
