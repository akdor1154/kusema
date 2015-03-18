var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;

var commentSchema = mongoose.Schema({
	_questionId: { type: objectId, required: true },
	author: { type: String, default: "anonymous" },
	message: { type: String, required: true },
	dateCreated: { type: Date, default: Date.now },
	dateModified: { type: Date, default: Date.now },
	upVotes: { type: Number, default: 1 },
	downVotes: { type: Number, default: 0 },
})

module.exports = mongoose.model('Comment', commentSchema);