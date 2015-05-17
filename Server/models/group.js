var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;

var groupSchema = mongoose.Schema({
    name:           { type: String, required: true },
    dateCreated:    { type: Date, default: Date.now },
    dateModified:   { type: Date, default: null },
    topics:         [{ type: objectId, ref: 'Topic' }]
})

module.exports = mongoose.model('Group', groupSchema);