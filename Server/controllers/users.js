var User = require('../models/user');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;

exp.findUserById = function (req, res, next) {
  User.findById(req.params.userId)
  .then( res.json )
  .catch( next );
};

exp.findUserByUsername = function (req, res, next) {
  User.findOne(
    { 'local.username': req.body.username }
  )
  .then( res.json )
  .catch( next );
};
