var Comment = require('../models/comment');

var exp = module.exports;

exp.retrieveAll = function(req, res, next) {
	var getComments = Comment.find(
		{ '_questionId': req.params.questionId }
	).exec();

	getComments.addBack(function (err, comments) {
		if (err) return next(err);
		res.json(comments);
	})
};

exp.addComment = function(req, res, next) {
	var comment = new Comment();
	
	comment.author = "example user";//TODO Add real users
	comment.message = req.body.message;
	comment._questionId = req.body.questionId;

	comment.save( function (err, comment) {
		if (err) return next(err);
		res.json(comment)
	});
};

exp.deleteComment = function(req, res, next) {
	var deleteComment = Comment.find(
		{ '_id': req.params.commentId }
	).remove().exec();

	deleteComment.addBack( function (err, comments) {
		if (err) return next(err);
		res.json({ 'deleted': true });//TODO: check if this is needed
	})
};

exp.upVote = function(req, res, next) {
	// TODO add auth info ensure 1 vote per person

	var upVote = Comment.update(
		{ '_id': req.params.commentId },
		{ $inc: { 'upVotes': 1 }}
	).exec();

	upVote.addBack( function (err) {
		if(err) return next(err);
		// TODO Add return value?
	})

};

exp.downVote = function(req, res, next) {
	// TODO add auth info ensure 1 vote per person

	var downVote = Comment.update(
		{ '_id': req.params.commentId },
		{ $inc: { 'downVotes': 1 }}
	).exec();

	upVote.addBack( function (err) {
		if(err) return next(err);
		// TODO Add return value?
	})

};
