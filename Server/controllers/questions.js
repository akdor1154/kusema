var Question = require('../models/question');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;

exp.findById = function (req, res, next) {
  var getQuestion = Question.findOne(
    { '_id': new ObjectId(req.params.questionId) }
  ).exec();

  getQuestion.addBack( function (err, question) {
    if (err) return next(err);
    res.json(question);
  });
};

exp.nextTenQuestions = function (req, res, next) {
  Question.find()
  .sort({ 'upVotes': 1, 'downVotes': -1 })
  .skip(10*req.params.requestNumber)
  .limit(10)
  .exec( function (err, questions) {
    if(err) return next(err);
    res.json(questions)
  });
};

exp.retrieveAll = function (req, res, next) {
  var getQuestions = Question.find().exec();

  getQuestions.addBack( function (err, questions) {
    if (err) return next(err);
    res.json(questions);
  })
};

exp.addQuestion = function (req, res, next) {
  console.log(req.body.author)
  console.log(req.body.title)
  console.log(req.body.message)
  var question = new Question();
  question.author = req.body.author;//TODO Add real users
  question.title = req.body.title;
  question.message = req.body.message;

  question.save( function (err, question) {
    if (err) return next(err);
    res.json(question)
  });
};

exp.updateQuestion = function (req, res, next) {
// TODO add auth info ensure only user and admin can update
	console.log(req.body);
  var updateQuestion = Question.update(
    { '_id': new ObjectId(req.params.questionId) },
    { $set: { 'message': req.body.message, 'title': req.body.title, 'dateModified': new Date() }}
  ).exec();

  updateQuestion.addBack( function (err, updated, raw) {
    if (err) return next(err);
    res.json(raw);
  });
};

exp.deleteQuestion = function (req, res, next) {
// TODO add auth info ensure only user and admin can delete
  var deleteQuestion = Question.find(
    { '_id': new ObjectId(req.params.questionId) }
  ).remove().exec();

  deleteQuestion.addBack( function (err, deleted) {
    if (err) return next(err);
    res.json(deleted);
  })
};

exp.upVote = function(req, res, next) {
// TODO add auth info ensure 1 vote per person

  var upVote = Question.update(
    { '_id': new ObjectId(req.params.questionId) },
    { $inc: { 'upVotes': 1 }}
  ).exec();

  upVote.addBack( function (err, upVoted) {
    if(err) return next(err);
    res.json(upVoted);
  })

};

exp.downVote = function(req, res, next) {
// TODO add auth info ensure 1 vote per person

  var downVote = Question.update(
    { '_id': new ObjectId(req.params.questionId) },
    { $inc: { 'downVotes': 1 }}
  ).exec();

  downVote.addBack( function (err, downVoted) {
    if(err) return next(err);
    res.json(downVoted);
  })

};