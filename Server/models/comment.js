var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;
var content  = require('./content');

var commentSchema = mongoose.Schema({
    questionId:     { type: objectId, ref: 'Question', required: true },
    answerId:       { type: objectId, ref: 'Answer', default: null },
    author:         { type: objectId, ref: 'User', required: true },
    anonymous: 	    { type: Boolean, required: true },
    message:        { type: String, required: true },
    dateCreated:    { type: Date, default: Date.now },
    dateModified:   { type: Date, default: null },
    upVotes:        [{ type: objectId, ref: 'User' }],
    downVotes:      [{ type: objectId, ref: 'User' }]
})

module.exports = mongoose.model('Comment', commentSchema);