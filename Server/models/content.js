var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;

var imageSchema = mongoose.Schema({
    type:       { type: String, required: true },
    url:        { type: String },
    data:       { type: String },
    ref:        { type: String },
    index:      { type: Number, required: true }
})

module.exports.imageModel = mongoose.model('Image', imageSchema);


var videoSchema = mongoose.Schema({
    type:       { type: String, required: true },
    url:        { type: String },
    data:       { type: String },
    ref:        { type: String },
    index:      { type: Number, required: true }
})

module.exports.videoModel = mongoose.model('Video', videoSchema);


var codeSchema = mongoose.Schema({
    language:   { type: String, required: true },
    content:    { type: String },
    index:      { type: Number, required: true }
})

module.exports.codeModel = mongoose.model('Code', codeSchema);