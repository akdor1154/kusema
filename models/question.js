var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;

var questionSchema = mongoose.Schema({
	author: { type: objectId }, //TODO add requirement here
	message: { type: String, required: true },
	dateCreated: { type: Date, default: Date.now },
	dateModified: { type: Date, default: Date.now },
	upVotes: { type: Number, default: 1 },
	downVotes: { type: Number, default: 0 },
})

module.exports = mongoose.model('Question', questionSchema);