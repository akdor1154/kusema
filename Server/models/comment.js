var mongoose        = require('mongoose');
var ObjectId        = mongoose.Schema.Types.ObjectId;
var contentMethods  = require('./common/contentMethods');
var socketio				= require('../config/socketio');

// Schema definition
var commentSchema = new contentMethods.BaseContentSchema({
    parent:     { type: ObjectId, ref: 'BaseContent', required: true },
})

var emitChanged = function(comment) {
	contentMethods.BaseContent.findById(this.parent)
	   .then(function(parent) {
			socketio.io.emit('contentChanged', {'_id': parent._id, 'comments':parent.comments});
	   }, function(error) {
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
	contentMethods.BaseContent.update({_id: this.parent},{$addToSet:{'comments': this._id}}, next)
})
commentSchema.pre('remove', function(next) {
	contentMethods.BaseContent.update({_id: this.parent},{$pull:{'comments': this._id}}, next);
})

commentSchema.post('save', function() {

	//DRY way, slower
	console.log('finding '+this.parent);
	return this.findRootQuestion()
	.then(function(question) {
		console.log('got question:'+question.title);
		return Promise.all([
			question.setNumComments(),
			question.setDateLastReply()
		]).then( function() { console.log('updated question'); return question });
	})
	.then(function(question) {
		return question.save();
	})

})

commentSchema.post('save', emitChanged);
commentSchema.post('remove', emitChanged);

commentSchema.methods.setFromJSON = function(data, userId) {
    this.__proto__.__proto__.setFromJSON.call(this, data, userId);
    //don't allow resetting the comment's parent
	if (data.parent && !this.parent) {
			this.parent = data.parent;
		}
}

commentSchema.methods.findRootQuestion = function() {
	return contentMethods.BaseContent.findOne({
			$or: [

				{
					_id: this.parent,
					__t: 'Question',
				},

				{'answers': this.parent}

			]
		}).exec();
}


module.exports = contentMethods.BaseContent.discriminator('Comment', commentSchema);