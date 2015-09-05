var mongoose        = require('mongoose');
var objectId        = mongoose.Schema.Types.ObjectId;
var contentMethods  = require('./common/contentMethods');
var socketio				= require('../config/socketio');

// Schema definition
var commentSchema = new contentMethods.BaseContentSchema({
    parent:     { type: objectId, ref: 'BaseContent', required: true },
})

var emitChanged = function(comment) {
	console.log('finding');
	console.log(comment);
	console.log('this');
	console.log(this);
	contentMethods.BaseContent.findById(this.parent)
	   .then(function(parent) {
	   		console.log('found you!');
	   		console.log(parent);
			socketio.io.emit('contentChanged', {'_id': parent._id, 'comments':parent.comments});
	   }, function(error) {
	   	console.log('oops');
	   	console.log(error);
	   })
}

// Indexes
commentSchema.index({ parent: 1, dateCreated: -1 });
commentSchema.index({ author: 1, dateCreated: -1 });
commentSchema.index({ upVotes: 1 });
commentSchema.index({ downVotes: 1 });
commentSchema.path('message').index({text : true});

commentSchema.pre('save', function(next) {
	console.log('updating daddy');
	contentMethods.BaseContent.update({_id: this.parent},{$addToSet:{'comments': this._id}}, next);
	console.log('daddy updated');
})
commentSchema.pre('remove', function(next) {
	contentMethods.BaseContent.update({_id: this.parent},{$pull:{'comments': this._id}}, next);
})
commentSchema.post('save', emitChanged);
commentSchema.post('remove', emitChanged);


module.exports = contentMethods.BaseContent.discriminator('Comment', commentSchema);