'use strict';

var Question = require('../models/question');

var exp = module.exports;

exp.findByQuestionId = function (req, res, next) {
  return Question.findById(req.params.questionId)
};

exp.nextTenQuestions = function (req, res, next) {
  // TODO This will be replaced with the feed soon...
  return Question.find()
};

exp.addQuestion = function (req, res, next) {
  var question = new Question();

  question.title        = req.body.title;
  question.author       = req.user._id;
  question.authorName   = req.body.authorName;
  question.anonymous    = req.body.anonymous;
  question.message      = req.body.message;
  question.group        = req.body.group;
  question.topics       = req.body.topics;
  question.upVotes.     push(req.user._id);

  return question.save()
};

exp.updateQuestion = function (req, res, next) {
// TODO add auth info ensure only user and admin can update
  return Question.findById(req.params.questionId)
  .then(function(question) {
    question.message = req.body.message;
    question.title = req.body.title;
    question.group        = req.body.group;
    question.topics        = req.body.topics;
    question.dateModified = new Date();
    return question.save();
  })
};

exp.deleteQuestion = function(req, res, next) {
    // TODO add auth info ensure only creator, mods and admin can delete
    return Question.setAsDeleted(req.params.questionId, req.user._id)
};

exp.upVoteQuestion = function(req, res, next) {
    return Question.upVote(req.params.questionId, req.user._id)
};

exp.downVoteQuestion = function(req, res, next) {
    return Question.downVote(req.params.questionId, req.user._id)
};
