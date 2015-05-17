var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;
var content  = require('./content');

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
    downVotes:      [{ type: objectId, ref: 'User' }]
})

module.exports = mongoose.model('Answer', answerSchema);