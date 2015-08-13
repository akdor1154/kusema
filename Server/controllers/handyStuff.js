var exp = module.exports;

var objectId = require('mongoose').Types.ObjectId;

exp.objectIdOrNull = function(objectIdString) {
	if (objectIdString) {
		return new objectId(objectIdString);
	} else if (objectIdString == null) {
		return null;
	} else {
		return undefined;
	}
}

