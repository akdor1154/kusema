var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;

var answerSchema = mongoose.Schema({
	_questionId: 	{ type: objectId, required: true },
	author: 		{ type: String }, //TODO add object ID requirement here
	message: 		{ type: String, required: true },
	imageUrl: 		{ type: String },
	videoUrl: 		{ type: String },
	dateCreated: 	{ type: Date, default: Date.now },
	dateModified: 	{ type: Date, default: Date.now },
	upVotes: 		{ type: Number, default: 1 },
	downVotes: 		{ type: Number, default: 0 }
})

module.exports = mongoose.model('Answer', answerSchema);