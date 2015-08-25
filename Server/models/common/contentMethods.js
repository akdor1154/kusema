'use strict';

var util            = require('util');
var mongoose		= require('mongoose');

var media           = require('./media');
var ObjectId 		= require('mongoose').Schema.Types.ObjectId;

var autoPopulate 	= require('mongoose-autopopulate');

var upVote = function (contentId, userId, cb) {
	return this.update({'_id': contentId},
		{
			$pull: {'downVotes': userId},
			$addToSet: {'upVotes': userId}
		}).exec(cb);
}

var downVote = function (contentId, userId, cb) {
	return this.update({'_id': contentId},
		{	
			$pull: {'upVotes': userId},
			$addToSet: {'downVotes': userId}
		}).exec(cb);
}

var removeVotes = function (contentId, userId, cb) {
	return this.update({'_id': contentId},
		{$pull: {'upVotes': userId, 'downVotes': userId}})
	.exec(cb);
}

var setAsDeleted = function (contentId, userId, cb) {
	// check if user has permission to delete
	return this.update({'_id': contentId},
		{$set: {deleted: true}})
	.exec(cb);
}

var BaseContentSchema = function() {

	mongoose.Schema.apply(this, arguments);

	this.add({
	    author:         { type: ObjectId, ref: 'User', required: true, autopopulate: {select: 'username'} },
	    authorName:     { type: String, required: false }, 
	    anonymous:      { type: Boolean, default: false },
	    message:        { type: String, required: true },
	    comments: 		{ type: Array, schema: ObjectId, ref: 'Comment', autopopulate: {select: 'author message'}},
		
	    dateCreated:    { type: Date, default: Date.now },
	    dateModified:   { type: Date, default: null },
	    upVotes:        [{ type: ObjectId, ref: 'User' }],
	    downVotes:      [{ type: ObjectId, ref: 'User' }],
	    deleted:        { type: Boolean, default: false }
	})


	this.statics.upVote = upVote;
	this.statics.downVote = downVote;
	this.statics.delete = setAsDeleted;
	this.plugin(autoPopulate);
}
util.inherits(BaseContentSchema, mongoose.Schema);

module.exports.BaseContentSchema = BaseContentSchema;
module.exports.BaseContent = mongoose.model('BaseContent', new module.exports.BaseContentSchema());