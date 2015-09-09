var Comment = require('../models/comment');
var ObjectId = require('mongoose').Types.ObjectId;
var objectIdOrNull = require('../controllers/handyStuff.js')


var exp = module.exports;

exp.findByQAId = function(req, res, next) {
	findQuery = [];
	//I wholeheartedly apologize for the following godawful mess and will fix soon :)
	propertiesToFind ['questionId', 'answerId'];
	propertiesToFind.foreach(function(property) {
		var valueToPush;
		if (req.query[property]) {
			valueToPush = objectIdOrNull(req.query[property]);
		}
		var underscoreProperty = '_'+property;
		findQuery.push({underscoreProperty: valueToPush});
	});

	return Comment.find({$and: findQuery});
};

exp.addByQAId = function(req, res, next) {
	var comment = new Comment();

	comment.author  = req.user._id;
	comment.message = req.body.message;
	comment.parent  = new ObjectId(req.params.parentId);

	return comment.save();
};

exp.findByCommentId = function(req, res, next) {
	return Comment.findById(req.params.commentId)
}

exp.updateComment = function(req, res, next) {
	return Comment.findById(req.params.commentId)
	.then( function(comment) {
		comment.message = req.body.message;
		return comment.save();
	})
}

exp.deleteComment = function(req, res, next) {
  
    // TODO add auth info ensure only creator, mods and admin can delete

    return Comment.setAsDeleted(req.params.commentId, req.user._id)
};

exp.upVoteComment = function(req, res, next) {
    return Comment.upVote(req.params.commentId, req.user._id);
};

exp.downVoteComment = function(req, res, next) {
    return Comment.downVote(req.params.commentId, req.user._id);
};
