var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;

// Schema definition
var groupSchema = mongoose.Schema({
    name:           { type: String, required: true },
    dateCreated:    { type: Date, default: Date.now },
    dateModified:   { type: Date, default: null },
    topics:         [{ type: objectId, ref: 'Topic' }],
    deleted:        { type: Boolean, default: false }
})

// Indexes
groupSchema.path('name').index({text : true});


module.exports = mongoose.model('Group', groupSchema);