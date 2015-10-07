'use strict';

var Question = require('../models/question');
var User = require('../models/user');
var Interaction = require('../models/interaction');

var exp = module.exports;

exp.findByQuestionId = function (req, res, next) {


  var q = Question.findById(req.params.questionId)
  console.log('just found');
  if (req.user && req.user._id) {
    q.then(function(question) {
      console.log('about to log');
      Interaction.log(req.user._id, 'read', question);
    })
    .catch(function(error) {
      console.error(error);
    })
  }

  return q;
  /*
  .then( function(question) {
    return question.setStats()
  })
  .then( function(question) {
    return question.save();
  });
  */
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


  if (req.user) {
    var interestedScores;
    try {
      interestedScores = Object.keys(req.user.stats.topicScores).filter(function(topic) {
        return req.user.stats.topicScores[topic] > 0.5;
      });
    } catch (e) {
        console.error(e);
        console.error('couldn\'t get interested topics for '+req.user.username);
    }

    var orQuery = {
      $match: { $or: [
        { 'group': { $in: req.user.authcateSubscriptions.groups } },
        { 'group': { $in: req.user.manualSubscriptions.groups } },
        { 'topics': { $in: interestedScores } },
        { 'author': req.user._id }
      ] }
    }

  } else {
    var orQuery = {$match: {__t: 'Question'}}
  }


  var requestNumber = req.params.requestNumber || 0;

  var questionsToGive = Question.aggregate([
      { $match: {
        __t: 'Question'
        //dateCreated: { $gt: new Date() - 1000 * 60 * 60 * 24 * 30 * 2 } // exclude < two months ago, otherwise this query will be chockers
      } },

      orQuery,

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
            ]},
            {$multiply: [
              { '$cond': [
                /*if*/  { $eq: [
                          '$stats.numAnswers',
                          0
                        ] },

                /*then*/ 1,
                /*else*/ 0
              ] },
              10
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

      {$skip: requestNumber * 10},
      {$limit: 10}
  ]);


  return questionsToGive.exec()
  .then( function(questions) {
    if (questions.length == 0 ) {
      res.status(204);
    }
    return User.populate(questions, {path: 'author'});
  });
}

exp.addQuestion = function (req, res, next) {
  var question = new Question();
  question.setFromJSON(req.body, req.user._id);
  question.upVotes.     push(req.user._id);


  var s = question.save();

  s.then( function(question) {
    Interaction.log(req.user._id, 'post', question);
  });

  return s;
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
    return Question.upVote(req.params.questionId, req.user._id);
};

exp.downVoteQuestion = function(req, res, next) {
    return Question.downVote(req.params.questionId, req.user._id);
};

exp.unVoteQuestion = function(req, res, next) {
  return Question.removeVotes(req.params.questionId, req.user._id);
}
