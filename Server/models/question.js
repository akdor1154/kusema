var mongoose        = require('mongoose');
var objectId        = mongoose.Schema.Types.ObjectId;
var media           = require('./common/media');
var contentMethods  = require('./common/contentMethods');

// Schema definition
var questionSchema = mongoose.Schema({
    title:          { type: String, required: true },
    author:         { type: objectId, ref: 'User', required: true },
    anonymous:      { type: Boolean, required: true },
    message:        { type: String, required: true },
    topics:         [{ type: objectId, ref: 'Topic' }],
    group:          { type: objectId, ref: 'Group', required: true },
    images:         [{ type: media.imageModel }],
    videos:         [{ type: media.videoModel }],
    code:           [{ type: media.codeModel }],
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
questionSchema.index({ upVotes: 1 });
questionSchema.index({ downVotes: 1 });
questionSchema.path('title').index({text : true});
questionSchema.path('message').index({text : true});

questionSchema.virtual('comments').get(function() {
    return Comment.find({$and: [{questionId: this._id}, {answerId: null}]}).exec();
}.bind(this));

questionSchema.set('toJSON', {virtuals: true});

// Static Methods
questionSchema.statics.upVote = contentMethods.upVote;
questionSchema.statics.downVote = contentMethods.downVote;
questionSchema.statics.delete = contentMethods.delete;


module.exports = mongoose.model('Question', questionSchema);