var Answer = require('../models/answer');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;

exp.findByQuestionId = function(req, res, next) {
    Question.findById(req.params.questionId)
    .then(
        function(question) {
            res.json(question.answers);
        },
        function(error) {
            next(error);
        }
    );
};

exp.addByQuestionId = function(req, res, next) {

    var answer = new Answer();
    
    answer.author       = new ObjectId(req.user._id);
    answer.anonymous    = req.body.anonymous;
    answer.message      = req.body.message;
    answer.question   = new ObjectId(req.params.questionId);
    answer.upVotes.     push(req.user._id);

    answer.save().then(
        function(answer) {
            // if we want out plugins to run, i.e. autopopulation, then we need to run a database find :(
            Answer.findById(answer._id).then(res.mjson.bind(res));
        },
        function (error) {
            next(error);
        });
};

exp.deleteAnswer = function(req, res, next) {
  
    // TODO add auth info ensure only creator, mods and admin can delete

    Answer.setAsDeleted(req.params.answerId, req.user._id).then(
        res.json,
        next
    );
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
