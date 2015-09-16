var mongoose        = require('mongoose');
var ObjectId        = mongoose.Schema.Types.ObjectId;
var Question        = require('../models/question');
var media           = require('./common/media');
var contentMethods  = require('./common/contentMethods');

// Schema definition
var answerSchema = new contentMethods.BaseContentSchema({
    question:     { type: ObjectId, ref: 'Question', required: true },
    isAccepted:     { type: Boolean, ref: 'Answer', default: false}
})

// Indexes
answerSchema.index({ question: 1, dateCreated: -1 });
answerSchema.index({ author: 1, dateCreated: -1 });
answerSchema.index({ upVotes: 1 });
answerSchema.index({ downVotes: 1 });
answerSchema.path('message').index({text : true});

answerSchema.pre('save', function(next) {
    Question.update({_id: this.question},{$addToSet:{'answers': this._id}}, next);
})
answerSchema.pre('remove', function(next) {
    Question.update({_id: this.question},{$pull:{'answers': this._id}}, next);
})

answerSchema.methods.setFromJSON = function(data, userId) {
    this.__proto__.__proto__.setFromJSON.call(this, data, userId);
    this.question = data.question;
}

// Validation
answerSchema.path('question').validate(function (value, respond) {

    Question.count({_id: value}, function (err, doc) {
        if (err || !doc) {
            console.error(err);
            console.error(doc);
            console.error(value);
            respond(false);
        } else {
            respond(true);
        }
    });

}, 'Question does not exist');


module.exports = contentMethods.BaseContent.discriminator('Answer', answerSchema);