var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({
	authcate: { type: String, required: true },
	username: { type: String },
	monashEmail: { type: String },
	password: { type: String },
	dateCreated: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', userSchema);