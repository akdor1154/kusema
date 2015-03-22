var User = require('../models/user');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;

exp.findUserById = function (req, res, next) {
  var getUser = User.findOne(
    { '_id': new ObjectId(req.params.userId) }
  ).exec();

  getUser.addBack( function (err, user) {
    if (err) return next(err);
    res.json(user);
  });
};

exp.findUserByUsername = function (req, res, next) {
  var getUser = User.findOne(
    { 'local.username': req.body.username }
  ).exec();

  getUser.addBack( function (err, user) {
    if (err) return next(err);
    res.json(user);
  });
};
