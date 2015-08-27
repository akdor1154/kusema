'use strict';

var mongoose        = require('mongoose');
var objectId        = mongoose.Schema.Types.ObjectId;
var media           = require('./common/media');
var contentMethods  = require('./common/contentMethods');

var Comment         = require('./comment.js');

var autoPopulate 	= require('mongoose-autopopulate');

// Schema definition
var questionSchema = new contentMethods.BaseContentSchema({
    title:          { type: String, required: true },
    topics:         [{ type: objectId, ref: 'Topic' }],
    group:          { type: objectId, ref: 'Group', required: false }, //TODO: SET REQUIRED TO TRUE!!
    answers:        {
    					type: Array,
    					schema: objectId, ref: 'Answer',
    					autopopulate: true
    				}
});


// Indexes
questionSchema.index({ topics: 1, dateCreated: -1 });
questionSchema.index({ author: 1, dateCreated: -1 });
questionSchema.index({ group: 1, dateCreated: -1 });
questionSchema.index({ upVotes: 1 });
questionSchema.index({ downVotes: 1 });
questionSchema.path('title').index({text : true});
questionSchema.path('message').index({text : true});


module.exports = contentMethods.BaseContent.discriminator('Question', questionSchema);