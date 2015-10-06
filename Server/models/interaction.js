var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require('./user.js');
var Question = require('./question.js');
var BaseContent = require('./common/contentMethods.js').BaseContent;
var weightings = require('../config/weightings.js').topicWeightings;

// Schema definition
var interactionSchema = mongoose.Schema({
    user:           { type: ObjectId, ref: 'User', required: true },
    action:         { type: String, required: true, enum: ['post', 'read'] },
    contentType:    { type: String, required: true, enum: ['Question', 'Comment', 'Answer'] },
    content:        { type: ObjectId, ref: 'BaseContent', required: true},
    topics:         [{ type: String, ref: 'Topic' }],
    date:           { type: Date, required: true, default: Date.now }
})

// Indexes
interactionSchema.index({ user: 1, date: -1 });
interactionSchema.index({ user: 1, contentType: 1});
interactionSchema.index({ content: 1, date: -1});


module.exports = mongoose.model('Interaction', interactionSchema);