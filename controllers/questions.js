var Question = require('../models/question');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;

exp.findById = function(req, res, next) {
  var getQuestion = Question.findOne(
    { '_id': new ObjectId(req.params.questionId) }
  ).exec();

  getQuestion.addBack( function(err, question) {
    if (err) return next(err);
    res.json(question);
  });
};

exp.nextTenQuestions = function(req, res, next) {
  Question.find()
  .sort({ 'upVotes': 1, 'downVotes': -1 })
  .skip(10*req.params.requestNumber)
  .limit(10)
  .exec( function (err, questions) {
    if(err) return next(err);
    res.json(questions)
  });
};

exp.retrieveAll = function(req, res, next) {
  var getQuestions = Question.find().exec();

  getQuestions.addBack(function (err, questions) {
    if (err) return next(err);
    res.json(questions);
  })
};

exp.addQuestion = function(req, res, next) {
  var question = new Question();
  //question.author = "example user";//TODO Add real users
  question.message = req.body.message;

  question.save( function (err, question) {
    if (err) return next(err);
    res.json(question)
  });
};

exp.updateQuestion = function(req, res, next) {
  var updateQuestion = Question.update(
    { '_id': new ObjectId(req.params.questionId) },
    { $set: { 'message': req.body.message, 'dateModified': new Date() }}
  ).exec();

  updateQuestion.addBack( function(err, numAffected, raw) {
    if (err) return next(err);
    res.json(raw);
  });
};

// exp.deleteComment = function(req, res, next) {
// var deleteComment = Comment.find(
// { '_id': req.params.commentId }
// ).remove().exec();

// deleteComment.addBack( function (err, comments) {
// if (err) return next(err);
// res.json({ 'deleted': true });//TODO: check if this is needed
// })
// };

// exp.upVote = function(req, res, next) {
// // TODO add auth info ensure 1 vote per person

// var upVote = Comment.update(
// { '_id': req.params.commentId },
// { $inc: { 'upVotes': 1 }}
// ).exec();

// upVote.addBack( function (err) {
// if(err) return next(err);
// // TODO Add return value?
// })

// };

// exp.downVote = function(req, res, next) {
// // TODO add auth info ensure 1 vote per person

// var downVote = Comment.update(
// { '_id': req.params.commentId },
// { $inc: { 'downVotes': 1 }}
// ).exec();

// upVote.addBack( function (err) {
// if(err) return next(err);
// // TODO Add return value?
// })

// };