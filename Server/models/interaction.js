var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;

var interactionSchema = mongoose.Schema({
    user:           { type: objectId, ref: 'User', required: true },
    action:         { type: String, required: true },
    topics:         [{ type: objectId }],
    date:           { type: Date, default: Date.now }
})

module.exports = mongoose.model('Interaction', interactionSchema);