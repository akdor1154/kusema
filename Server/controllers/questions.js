'use strict';

var Question = require('../models/question');
var User = require('../models/user');

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

exp.feed = function ( req, res, next ) {
  var questionsToGive = Question.aggregate([
      { $match: {__t: 'Question'}},

      {$project: 
        {sortScore: 
          {$add: [
            {$multiply: [
              {$subtract: [new Date(), '$dateCreated' ] },
              1/1000 * 1/60 * 1/60, // millseconds to hours
              -0.005 //score per hour
            ]},
            {$multiply: [
              {$subtract: [new Date(), '$stats.dateLastReply' ] },
              1/1000 * 1/60 * 1/60,
              -0.05
            ]},
            {$multiply: [
              '$stats.numComments',
              1
            ]},
            {$multiply: [
              '$stats.numAnswers',
              1
            ]}
          ]},

          //TODO: enforce mongo 2.6, then just use $$ROOT
          title: 1,
          author: 1,
          dateCreated: 1,
          dateModified: 1,
          anonymous: 1,
          authorName: 1,
          message: 1,
          upVotes: 1,
          downVotes: 1,
          topics: 1,
          group: 1,
          __t: 1
        } },

      {$sort:
        {sortScore: -1}
      },
  ]);

  return questionsToGive.exec()
  .then( function(questions) {
    return User.populate(questions, {path: 'author'});
  });
}

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
