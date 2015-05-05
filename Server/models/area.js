var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;

var areaSchema = mongoose.Schema({
	title: 			{ type: String, required: true },
	dateCreated: 	{ type: Date, default: Date.now },
	dateModified: 	{ type: Date, default: Date.now }
})

module.exports = mongoose.model('Area', areaSchema);