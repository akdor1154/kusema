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

	Comment.find({$and: findQuery})
	.then( res.json )
	.catch( next );
};

exp.addByQAId = function(req, res, next) {
	var comment = new Comment();

	comment.author  = req.user._id;
	comment.message = req.body.message;
	comment.parent  = new ObjectId(req.params.parentId);

	comment.save()
	.then( res.json )
	.catch ( next );
};

exp.findByCommentId = function(req, res, next) {
	Comment.findById(req.params.commentId)
	.then( res.json )
	.catch( next );
}

exp.updateComment = function(req, res, next) {
	Comment.findById(req.params.commentId)
	.then( function(comment) {
		comment.message = req.body.message;
		return comment.save();
	})
	.then( res.json )
	.catch( next );
}

exp.deleteComment = function(req, res, next) {
  
    // TODO add auth info ensure only creator, mods and admin can delete

    Comment.setAsDeleted(req.params.commentId, req.user._id)
    .then( res.mjson )
    .catch( next );
};

exp.upVoteComment = function(req, res, next) {
    Comment.upVote(req.params.commentId, req.user._id)
    .then( res.json )
    .catch( next );
};

exp.downVoteComment = function(req, res, next) {
    Comment.downVote(req.params.commentId, req.user._id)
    .then( res.json )
    .catch( next );
};
