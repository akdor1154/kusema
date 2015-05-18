var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;

// Schema definition
var interactionSchema = mongoose.Schema({
    user:           { type: objectId, ref: 'User', required: true },
    action:         { type: String, required: true },
    topics:         [{ type: objectId }],
    date:           { type: Date, default: Date.now }
})

// Indexes
interactionSchema.index({ user: 1, dateCreated: -1 });


module.exports = mongoose.model('Interaction', interactionSchema);