var mongoose        = require('mongoose');
var objectId        = mongoose.Schema.Types.ObjectId;
var contentMethods  = require('./common/contentMethods');

// Schema definition
var commentSchema = mongoose.Schema({
    questionId:     { type: objectId, ref: 'Question', required: true },
    answerId:       { type: objectId, ref: 'Answer', default: null },
    author:         { type: objectId, ref: 'User', required: true },
    anonymous:      { type: Boolean, required: true },
    message:        { type: String, required: true },
    dateCreated:    { type: Date, default: Date.now },
    dateModified:   { type: Date, default: null },
    upVotes:        [{ type: objectId, ref: 'User' }],
    downVotes:      [{ type: objectId, ref: 'User' }],
    deleted:        { type: Boolean, default: false }
})

// Indexes
commentSchema.index({ questionId: 1, dateCreated: -1 });
commentSchema.index({ answerId: 1, dateCreated: -1 });
commentSchema.index({ author: 1, dateCreated: -1 });
commentSchema.index({ upVotes: 1 });
commentSchema.index({ downVotes: 1 });
commentSchema.path('message').index({text : true});

// Static Methods
commentSchema.statics.upVote = contentMethods.upVote;
commentSchema.statics.downVote = contentMethods.downVote;
commentSchema.statics.setAsDeleted = contentMethods.setAsDeleted;


module.exports = mongoose.model('Comment', commentSchema);