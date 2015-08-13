var mongoose        = require('mongoose');
var objectId        = mongoose.Schema.Types.ObjectId;
var contentMethods  = require('./common/contentMethods');

// Schema definition
var commentSchema = new contentMethods.BaseContentSchema({
    questionId:     { type: objectId, ref: 'Question', required: true },
    answerId:       { type: objectId, ref: 'Answer', default: null }
})

// Indexes
commentSchema.index({ questionId: 1, dateCreated: -1 });
commentSchema.index({ answerId: 1, dateCreated: -1 });
commentSchema.index({ author: 1, dateCreated: -1 });
commentSchema.index({ upVotes: 1 });
commentSchema.index({ downVotes: 1 });
commentSchema.path('message').index({text : true});

module.exports = contentMethods.BaseContent.discriminator('Comment', commentSchema);