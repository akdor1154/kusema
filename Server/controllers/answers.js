var Answer = require('../models/answer');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;

exp.findByQuestionId = function(req, res, next) {
console.log("retrieveAnswersByQuestionId")
	var getAnswers = Answer.find(
		{ '_questionId': new ObjectId(req.params.questionId) }
	).exec();

	getAnswers.addBack(function (err, answers) {
		if (err) return next(err);
		res.json(answers);
	})
};

exp.addByQuestionId = function(req, res, next) {
	var answer = new Answer();
	console.log(req.body)
	//answer.author = "example user";//TODO Add real users
	answer.message = req.body.message;
	answer._questionId = new ObjectId(req.params.questionId);

	answer.save( function (err, answer) {
		if (err) return next(err);
		res.json(answer)
	});
};

exp.deleteAnswer = function(req, res, next) {
	var deleteAnswer = Answer.find(
		{ '_id': new ObjectId(req.params.answerId) }
	).remove().exec();

	deleteAnswer.addBack( function (err, deleted) {
		if (err) return next(err);
		res.json(deleted);
	})
};

exp.upVoteAnswer = function(req, res, next) {
	// TODO add auth info ensure 1 vote per person

	var upVote = Answer.update(
		{ '_id': new ObjectId(req.params.answerId) },
		{ $inc: { 'upVotes': 1 }}
	).exec();

	upVote.addBack( function (err, upVoted) {
		if(err) return next(err);
		res.json(upVoted);
	})

};

exp.downVoteAnswer = function(req, res, next) {
	// TODO add auth info ensure 1 vote per person

	var downVote = Answer.update(
		{ '_id': new ObjectId(req.params.answerId) },
		{ $inc: { 'downVotes': 1 }}
	).exec();

	downVote.addBack( function (err, downVoted) {
		if(err) return next(err);
		res.json(downVoted);
	})

};
