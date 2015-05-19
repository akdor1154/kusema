var ObjectId = require('mongoose').Types.ObjectId;

module.exports.upVote = function (contentId, userId, cb) {
	// TODO remove user from downvotes array
	return this.update({'_id': contentId},
		{$addToSet: {'upVotes': userId}})
	.exec(cb);
}

module.exports.downVote = function (contentId, userId, cb) {
	// TODO remove user from upvotes array
	return this.update({'_id': contentId},
		{$addToSet: {'downVotes': userId}})
	.exec(cb);
}

module.exports.removeVotes = function (contentId, userId, cb) {
	return this.update({'_id': contentId},
		{$pull: {'upVotes': userId, 'downVotes': userId}})
	.exec(cb);
}

module.exports.setAsDeleted = function (contentId, userId, cb) {
	// check if user has permission to delete
	return this.update({'_id': contentId},
		{$set: {deleted: true}})
	.exec(cb);
}