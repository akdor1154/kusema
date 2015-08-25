var mongoose        = require('mongoose');
var objectId        = mongoose.Schema.Types.ObjectId;
var contentMethods  = require('./common/contentMethods');

// Schema definition
var commentSchema = new contentMethods.BaseContentSchema({
    parent:     { type: objectId, ref: 'BaseContent', required: true },
})

// Indexes
commentSchema.index({ parent: 1, dateCreated: -1 });
commentSchema.index({ author: 1, dateCreated: -1 });
commentSchema.index({ upVotes: 1 });
commentSchema.index({ downVotes: 1 });
commentSchema.path('message').index({text : true});

commentSchema.pre('save', function(next) {
	contentMethods.BaseContent.update({_id: this.parent},{$push:{'comments': this._id}}, next);
})
commentSchema.pre('remove', function(next) {
	contentMethods.BaseContent.update({_id: this.parent},{$pull:{'comments': this._id}}, next);
})

module.exports = contentMethods.BaseContent.discriminator('Comment', commentSchema);