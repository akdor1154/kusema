var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;

var unitSchema = mongoose.Schema({
	title: 			{ type: String, required: true },
	code:	 		{ type: String },
	dateCreated: 	{ type: Date, default: Date.now },
	dateModified: 	{ type: Date, default: Date.now }
})

module.exports = mongoose.model('Unit', unitSchema);