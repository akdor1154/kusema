var mongoose        = require('mongoose');
var objectId        = mongoose.Schema.Types.ObjectId;
var Question        = require('../models/question');
var media           = require('./common/media');
var contentMethods  = require('./common/contentMethods');

// Schema definition
var answerSchema = mongoose.Schema({
    questionId:     { type: objectId, ref: 'Question', required: true },
    author:         { type: objectId, ref: 'User', required: true },
    anonymous:      { type: Boolean, required: true },
    message:        { type: String, required: true },
    imageUrls:      [{ type: media.imageModel }],
    videoUrls:      [{ type: media.videoModel }],
    code:           [{ type: media.codeModel }],
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

answerSchema.virtual('comments').get(function() {
    return Comment.find({answerId: this._id}).exec();
}.bind(this));

answerSchema.set('toJSON', {virtuals: true});

// Validation
answerSchema.path('questionId').validate(function (value, respond) {

    Question.count({_id: value}, function (err, doc) {
        if (err || !doc) {
            respond(false);
        } else {
            respond(true);
        }
    });

}, 'Question does not exist');

// Static Methods
answerSchema.statics.upVote = contentMethods.upVote;
answerSchema.statics.downVote = contentMethods.downVote;
answerSchema.statics.setAsDeleted = contentMethods.setAsDeleted;


module.exports = mongoose.model('Answer', answerSchema);