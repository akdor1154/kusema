var serverMessageDirective = function() {
	return {
		scope: {},
		bindToController: {
			'message': '=',
			'messagePrefix': '@'
		},
		templateUrl: 'common/components/ServerMessage/serverMessageTemplate.html',
		controller: 'kusemaServerMessageController',
		controllerAs: 'c',
		css: 'common/components/ServerMessage/serverMessage.css'
	};
}


var serverMessageController = function() {
	console.log('message!!');
	this.setMessageProperties();
}

serverMessageController.prototype = Object.create(Object.prototype, {
	'_message': {writable: true, enumerable: false, value: null},
	'message': {
		get: function() {
			return this._message;
		},
		set: function(newMessage) {
			console.log('setting message');
			this._message = newMessage;
			this.setMessageProperties();
		}
	},
	'messagePrefixBind': {
		get: function() {
			if (this.messagePrefix) {
				return this.messagePrefix + ': ';
			}
		}
	},
	'type': {writable: true, enumerable: false, value: ''},
	'messageText': {writable: true, enumerable: false, value: ''},
});

serverMessageController.prototype.setMessageProperties = function() {
	if (!this.message) {
		console.log('no error');
		delete this.type;
		delete this.messageText;
	} else {
		console.log('showing error');
		this.type = this.message.type || 'error';
		this.messageText = (this.message.data && this.message.data.message)
							|| this.message.data
							|| this.message.message
							|| this.message
							|| 'Server Problem';
	}
}

kusema.addModule('components.serverMessage')
      .directive('kusemaServerMessage', serverMessageDirective)
      .controller('kusemaServerMessageController', serverMessageController);