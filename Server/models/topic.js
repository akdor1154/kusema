var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;

// Schema definition
var topicSchema = mongoose.Schema({
    name:           { type: String, required: true },
    dateCreated:    { type: Date, default: Date.now },
    dateModified:   { type: Date, default: null }
})

// Indexes
topicSchema.path('name').index({text : true});


module.exports = mongoose.model('Topic', topicSchema);