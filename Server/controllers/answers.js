var Answer = require('../models/answer');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;

exp.findByQuestionId = function(req, res, next) {
    Question.findById(req.params.questionId)
    .then( function(question) {
        res.json(question.answers);
    })
    .catch( function(error) {
        next(error);
    });
};

exp.addByQuestionId = function(req, res, next) {
    var answer = new Answer();
    
    answer.author       = new ObjectId(req.user._id);
    answer.anonymous    = req.body.anonymous;
    answer.message      = req.body.message;
    answer.question     = new ObjectId(req.params.questionId);
    answer.upVotes.     push(req.user._id);

    return answer.save()
    .then( function(answer) {
            // if we want our plugins to run, i.e. autopopulation, then we need to run a database find :(
            return Answer.findById(answer._id)
    });
}

exp.deleteAnswer = function(req, res, next) {
    // TODO add auth info ensure only creator, mods and admin can delete
    return Answer.setAsDeleted(req.params.answerId, req.user._id);
};

exp.upVoteAnswer = function(req, res, next) {
    return Answer.upVote(req.params.answerId, req.user._id);
};

exp.downVoteAnswer = function(req, res, next) {
    Answer.downVote(req.params.answerId, req.user._id);
};
