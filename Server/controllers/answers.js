var Answer = require('../models/answer');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;

exp.findByQuestionId = function(req, res, next) {

    var getAnswers = Answer.find(
        { 'questionId': new ObjectId(req.params.questionId) }
    ).exec();

    getAnswers.addBack(function (err, answers) {
        if (err) return next(err);
        res.json(answers);
    })
};

exp.addByQuestionId = function(req, res, next) {

    var answer = new Answer();
    
    answer.author       = new ObjectId(req.user._id);
    answer.anonymous    = req.body.anonymous;
    answer.message      = req.body.message;
    answer.questionId   = new ObjectId(req.params.questionId);
    answer.upVotes.     push(req.user._id);

    answer.save( function (err, answer) {
        if (err) return next(err);
        res.json(answer)
    });
};

exp.deleteAnswer = function(req, res, next) {
  
    // TODO add auth info ensure only creator, mods and admin can delete
    var done = function (err, deleted) {
        if(err) return next(err);
        res.json(deleted);
    }

    Answer.setAsDeleted(req.params.answerId, req.user._id, done)
};

exp.upVoteAnswer = function(req, res, next) {

    var done = function (err, upVoted) {
        if(err) return next(err);
        res.json(upVoted);
    }

    Answer.upVote(req.params.answerId, req.user._id, done)
};

exp.downVoteAnswer = function(req, res, next) {

    var done = function (err, downVoted) {
        if(err) return next(err);
        res.json(downVoted);
    }

    Answer.downVote(req.params.answerId, req.user._id, done)
};
