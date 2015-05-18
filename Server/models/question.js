var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;
var content  = require('./content');

// Schema definition
var questionSchema = mongoose.Schema({
    title:          { type: String, required: true },
    author:         { type: objectId, ref: 'User', required: true },
    anonymous:      { type: Boolean, required: true },
    message:        { type: String, required: true },
    topics:         [{ type: objectId, ref: 'Topic' }],
    group:          { type: objectId, ref: 'Group' },
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
questionSchema.index({ topics: 1, dateCreated: -1 });
questionSchema.index({ author: 1, dateCreated: -1 });
questionSchema.index({ group: 1, dateCreated: -1 });
questionSchema.path('title').index({text : true});
questionSchema.path('message').index({text : true});


module.exports = mongoose.model('Question', questionSchema);