var UnauthorizedError = function(message) {
	Error.call(this);

	if (message) this.message = message;
};

UnauthorizedError.prototype = Object.create(Error.prototype, {
	'message': {writable: true, value: 'You are not allowed to do that'},
	'name': {writable: true, value: 'UnauthorizedError'},
	'status': {writable: true, value: 401}
});

module.exports = {'UnauthorizedError': UnauthorizedError};