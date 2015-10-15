var Answer = require('../models/answer');
var ObjectId = require('mongoose').Types.ObjectId;
var Interaction = require('../models/interaction.js');

var exp = module.exports;

exp.findByQuestionId = function(req, res, next) {
    return Question.findById(req.params.questionId)
    .then( function(question) {
        return question.answers;
    });
};

exp.addByQuestionId = function(req, res, next) {
    var data = req.body;
    data.question = req.params.questionId;

    var answer = new Answer();
    answer.setFromJSON(data, req.user._id);

    return answer.save()
    .then( function(answer) {
            Interaction.log(req.user._id, 'post', answer);
            // if we want our plugins to run, i.e. autopopulation, then we need to run a db find :(
            return Answer.findById(answer._id)
    });
}

exp.updateAnswer = function(req, res, next) {
    return Answer.findById(req.params.answerId)
    .then( function(answer) {
        console.log(answer);
        answer.setFromJSON(req.body, req.user._id);
        return answer.save();
    })
    .then( function(answer) {
        return answer.populate('author');
    })
    .then(function(answer) {

        console.log(answer);
        return answer;
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
    return Answer.downVote(req.params.answerId, req.user._id);
};

exp.unVoteAnswer = function(req, res, next) {
    return Answer.removeVotes(req.params.answerId, req.user._id);
};
