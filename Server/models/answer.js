var mongoose        = require('mongoose');
var objectId        = mongoose.Schema.Types.ObjectId;
var Question        = require('../models/question');
var media           = require('./common/media');
var contentMethods  = require('./common/contentMethods');

// Schema definition
var answerSchema = new contentMethods.BaseContentSchema({
    questionId:     { type: objectId, ref: 'Question', required: true },
    isAccepted:     { type: Boolean, ref: 'Answer', default: false}
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


module.exports = contentMethods.BaseContent.discriminator('Answer', answerSchema);