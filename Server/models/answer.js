var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;
var content  = require('./content');

// Schema definition
var answerSchema = mongoose.Schema({
    questionId:     { type: objectId, ref: 'Question', required: true },
    author:         { type: objectId, ref: 'User', required: true },
    anonymous:      { type: Boolean, required: true },
    message:        { type: String, required: true },
    imageUrls:      [{ type: content.imageModel }],
    videoUrls:      [{ type: content.videoModel }],
    code:           [{ type: content.codeModel }],
    dateCreated:    { type: Date, default: Date.now },
    dateModified:   { type: Date, default: null },
    upVotes:        [{ type: objectId, ref: 'User' }],
    downVotes:      [{ type: objectId, ref: 'User' }],
    deleted:        { type: Boolean, default: false }
})

// Indexes
answerSchema.index({ questionId: 1, dateCreated: -1 });
answerSchema.index({ author: 1, dateCreated: -1 });
answerSchema.index({ upVotes: 1 });
answerSchema.index({ downVotes: 1 });
answerSchema.path('message').index({text : true});


module.exports = mongoose.model('Answer', answerSchema);