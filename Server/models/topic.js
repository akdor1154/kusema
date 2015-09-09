var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;

// Schema definition
var topicSchema = mongoose.Schema({
    _id:            { type: String, required: true, unique: true }, 
    name:           { type: String, required: true },
    dateCreated:    { type: Date, default: Date.now },
    dateModified:   { type: Date, default: null },
    deleted: 		{ type: Boolean, default: false }
})

// Indexes
topicSchema.path('name').index({text : true});
topicSchema.pre('validate', function(next) {
	this._id = this.name;
	next();
});


module.exports = mongoose.model('Topic', topicSchema);