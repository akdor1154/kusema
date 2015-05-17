var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;
var content  = require('./content');

var questionSchema = mongoose.Schema({
    title: 	        { type: String, required: true },
    author:         { type: objectId, ref: 'User', required: true },
    anonymous:      { type: Boolean, required: true },
    message:        { type: String, required: true },
    topics:         [{ type: objectId, ref: 'Topic' }],
    group: 	        { type: objectId, ref: 'Group' },
    imageUrls:      [{ type: content.imageModel }],
    videoUrls:      [{ type: content.videoModel }],
    code:           [{ type: content.codeModel }],
    dateCreated:    { type: Date, default: Date.now },
    dateModified:   { type: Date, default: null },
    upVotes:        [{ type: objectId, ref: 'User' }],
    downVotes:      [{ type: objectId, ref: 'User' }]
})

module.exports = mongoose.model('Question', questionSchema);