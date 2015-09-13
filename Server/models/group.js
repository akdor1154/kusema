var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;
var Topic = require('./topic');

// Schema definition
var groupSchema = mongoose.Schema({
    _id:            { type: String, required: true, unique: true }, 
    name:           { type: String, required: true, unique: true },
    dateCreated:    { type: Date, default: Date.now },
    dateModified:   { type: Date, default: null },
    topics:         {
    		type: Array,
    		schema: {
    			type: objectId,
    			ref: 'Topic'
    		}
    	},
    unitCode:       {type: String, required: false },
    title:          {type: String, required: false },
    deleted:        { type: Boolean, default: false }
})


// Indexes
groupSchema.path('name').index({text : true, unique: true});
groupSchema.pre('validate', function(next) {
    this._id = this.unitCode || this.name;
    next();
});

module.exports = mongoose.model('Group', groupSchema);