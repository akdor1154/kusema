'use strict';

var util            = require('util');
var mongoose		= require('mongoose');

var media           = require('./media');
var ObjectId 		= require('mongoose').Schema.Types.ObjectId;

var autoPopulate 	= require('mongoose-autopopulate');

var upVote = function (contentId, userId) {
	return this.update({'_id': contentId},
		{
			$pull: {'downVotes': userId},
			$addToSet: {'upVotes': userId}
		});
}

var downVote = function (contentId, userId) {
	return this.update({'_id': contentId},
		{	
			$pull: {'upVotes': userId},
			$addToSet: {'downVotes': userId}
		});
}

var removeVotes = function (contentId, userId) {
	return this.update({'_id': contentId},
		{
			$pull: {'upVotes': userId, 'downVotes': userId}
		});
}

var setAsDeleted = function (contentId, userId) {
	// check if user has permission to delete
	return this.findById(contentId)
			   .then(function(content) {
			   		content.deleted = true;
			   		return content.save();
			   });
}

var BaseContentSchema = function() {

	mongoose.Schema.apply(this, arguments);

	this.add({
	    author:         { type: ObjectId, ref: 'User', required: true, autopopulate: {select: 'username displayName'} },
	    authorName:     { type: String, required: false }, 
	    anonymous:      { type: Boolean, default: false },
	    message:        { type: String, required: true },
	    comments: 		{ type: Array, schema: ObjectId, ref: 'Comment', autopopulate: {select: 'author message', match: { deleted: false}}},
		
	    dateCreated:    { type: Date, default: Date.now },
	    dateModified:   { type: Date, default: null },
	    upVotes:        [{ type: ObjectId, ref: 'User' }],
	    downVotes:      [{ type: ObjectId, ref: 'User' }],
	    deleted:        { type: Boolean, default: false }
	})


	this.statics.upVote = upVote;
	this.statics.downVote = downVote;
	this.statics.setAsDeleted = setAsDeleted;
	this.plugin(autoPopulate);
}
util.inherits(BaseContentSchema, mongoose.Schema);

module.exports.BaseContentSchema = BaseContentSchema;
module.exports.BaseContent = mongoose.model('BaseContent', new module.exports.BaseContentSchema());