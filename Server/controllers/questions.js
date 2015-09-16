'use strict';

var Question = require('../models/question');

var exp = module.exports;

exp.findByQuestionId = function (req, res, next) {
  return Question.findById(req.params.questionId)
};

exp.nextTenQuestions = function (req, res, next) {
  // TODO This will be replaced with the feed soon...
  if (req.params.groupID) {
    return Question.find({'group': req.params.groupID});
  } else {
    return Question.find()
  }
};

exp.addQuestion = function (req, res, next) {
  var question = new Question();
  question.setFromJSON(req.body, req.user._id);
  question.upVotes.     push(req.user._id);

  return question.save()
};

exp.updateQuestion = function (req, res, next) {
// TODO add auth info ensure only user and admin can update
  return Question.findById(req.params.questionId)
  .then(function(question) {
    question.setFromJSON(req.body, req.user._id);
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
