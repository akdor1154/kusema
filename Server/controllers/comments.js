var Comment = require('../models/comment');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;

exp.findByQuestionId = function(req, res, next) {
	var getComments = Comment.find(
		{ '_questionId': new ObjectId(req.params.questionId) }
	).exec();

	getComments.addBack(function (err, comments) {
		if (err) return next(err);
		res.json(comments);
	})
};

exp.addByParentId = function(req, res, next) {
	var comment = new Comment();

	//comment.author = "example user";//TODO Add real users
	comment.message = req.body.message;
	comment._questionId = new ObjectId(req.params.questionId);

	comment.save( function (err, comment) {
		if (err) return next(err);
		res.json(comment)
	});
};

exp.deleteComment = function(req, res, next) {
	var deleteComment = Comment.find(
		{ '_id': new ObjectId(req.params.commentId) }
	).remove().exec();

	deleteComment.addBack( function (err, deleted) {
		if (err) return next(err);
		res.json(deleted);
	})
};

exp.upVoteComment = function(req, res, next) {
	// TODO add auth info ensure 1 vote per person

	var upVote = Comment.update(
		{ '_id': new ObjectId(req.params.commentId) },
		{ $inc: { 'upVotes': 1 }}
	).exec();

	upVote.addBack( function (err, upVoted) {
		if(err) return next(err);
		res.json(upVoted);
	})

};

exp.downVoteComment = function(req, res, next) {
	// TODO add auth info ensure 1 vote per person

	var downVote = Comment.update(
		{ '_id': new ObjectId(req.params.commentId) },
		{ $inc: { 'downVotes': 1 }}
	).exec();

	downVote.addBack( function (err, downVoted) {
		if(err) return next(err);
		res.json(downVoted);
	})

};
