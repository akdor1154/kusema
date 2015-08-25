var Comment = require('../models/comment');
var ObjectId = require('mongoose').Types.ObjectId;
var objectIdOrNull = require('../controllers/handyStuff.js')


var exp = module.exports;

exp.findByQAId = function(req, res, next) {
	findQuery = [];
	propertiesToFind ['questionId', 'answerId'];
	propertiesToFind.foreach(function(property) {
		var valueToPush;
		if (req.query[property]) {
			valueToPush = objectIdOrNull(req.query[property]);
		}
		var underscoreProperty = '_'+property;
		findQuery.push({underscoreProperty: valueToPush});
	});

	var getComments = Comment.find({$and: findQuery}).exec();

	getComments.addBack(function (err, comments) {
		if (err) return next(err);
		res.json(comments);
	})
};

exp.addByQAId = function(req, res, next) {
	var comment = new Comment();

	comment.author = req.user._id;
	comment.message = req.body.message;
	comment.parent = new ObjectId(req.params.parentId);

	comment.save( function (err, comment) {
		if (err) return next(err);
		res.json(comment)
	});
};

exp.findByCommentId = function(req, res, next) {
	var getComment = Comment.findById(req.params.commentId).exec();
	getComment.addBack(function (err, comment) {
		if (err) return next(err);
		res.json(comment);
	});
}

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
