'use strict';

var Question = require('../models/question');

var exp = module.exports;

exp.findByQuestionId = function (req, res, next) {
  Question.findById(req.params.questionId)
  .then( res.mjson )
  .catch( next );
};

exp.nextTenQuestions = function (req, res, next) {
  // TODO This will be replaced with the feed soon...
  Question.find()
  .then( res.mjson )
  .catch( next );
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

  question.save()
  .then( res.json )
  .catch( next );
};

exp.updateQuestion = function (req, res, next) {
// TODO add auth info ensure only user and admin can update
  Question.findById(req.params.questionId)
  .then(function(question) {
    question.message = req.body.message;
    question.title = req.body.title;
    question.group        = req.body.group;
    question.topics        = req.body.topics;
    question.dateModified = new Date();
    return question.save();
  })
  .then( res.mjson )
  .catch( next );
};

exp.deleteQuestion = function(req, res, next) {
  
    // TODO add auth info ensure only creator, mods and admin can delete
    Question.setAsDeleted(req.params.questionId, req.user._id)
    .then( res.mjson )
    .catch( next );
};

exp.upVoteQuestion = function(req, res, next) {
    Question.upVote(req.params.questionId, req.user._id)
    .then( res.mjson )
    .catch( next );
};

exp.downVoteQuestion = function(req, res, next) {
    Question.downVote(req.params.questionId, req.user._id)
    .then( res.mjson )
    .catch( next );
};
