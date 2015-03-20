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

exp.addUser = function (req, res, next) {
  var user = new User();
  user.authcate = req.body.authcate;

  user.save( function (err, user) {
    if (err) return next(err);
    res.json(user)
  });
};