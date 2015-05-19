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
  
    // TODO add auth info ensure only creator, mods and admin can delete
    var done = function (err, deleted) {
        if(err) return next(err);
        res.json(deleted);
    }

    Comment.setAsDeleted(req.params.commentId, req.user._id, done)
};

exp.upVoteComment = function(req, res, next) {

    var done = function (err, upVoted) {
        if(err) return next(err);
        res.json(upVoted);
    }

    Comment.upVote(req.params.commentId, req.user._id, done)
};

exp.downVoteComment = function(req, res, next) {

    var done = function (err, downVoted) {
        if(err) return next(err);
        res.json(downVoted);
    }

    Comment.downVote(req.params.commentId, req.user._id, done)
};
