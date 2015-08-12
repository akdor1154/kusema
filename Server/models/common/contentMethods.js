'use strict';

var util            = require('util');
var mongoose		= require('mongoose');


var media           = require('./media');
var objectId = require('mongoose').Schema.Types.ObjectId;

module.exports.upVote = function (contentId, userId, cb) {
	// TODO remove user from downvotes array
	return this.update({'_id': contentId},
		{
			$pull: {'downVotes': userId},
			$addToSet: {'upVotes': userId}
		}).exec(cb);
}

module.exports.downVote = function (contentId, userId, cb) {
	// TODO remove user from upvotes array
	return this.update({'_id': contentId},
		{	
			$pull: {'downVotes': userId},
			$addToSet: {'downVotes': userId}
		}).exec(cb);
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


module.exports.BaseContentSchema = BaseContentSchema;


function BaseContentSchema() {

	mongoose.Schema.apply(this, arguments);

	this.add({
	    author:         { type: objectId, ref: 'User', required: true },
	    authorName:     { type: String, required: false }, 
	    anonymous:      { type: Boolean, default: false },
	    message:        { type: String, required: true },

		images:         [{ type: media.imageModel }],
	    videos:         [{ type: media.videoModel }],
	    code:           [{ type: media.codeModel }],
		
	    dateCreated:    { type: Date, default: Date.now },
	    dateModified:   { type: Date, default: null },
	    upVotes:        [{ type: objectId, ref: 'User' }],
	    downVotes:      [{ type: objectId, ref: 'User' }],
	    deleted:        { type: Boolean, default: false }
	})


	this.statics.upVote = module.exports.upVote;
	this.statics.downVote = module.exports.downVote;
	this.statics.delete = module.exports.delete;

}
util.inherits(BaseContentSchema, mongoose.Schema);


module.exports.BaseContent = mongoose.model('BaseContent', new module.exports.BaseContentSchema());