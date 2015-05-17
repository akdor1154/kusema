var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;

var topicSchema = mongoose.Schema({
    name:           { type: String, required: true },
    dateCreated:    { type: Date, default: Date.now },
    dateModified:   { type: Date, default: null }
})

module.exports = mongoose.model('Topic', topicSchema);