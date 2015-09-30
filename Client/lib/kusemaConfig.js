'use strict';

import kusema from 'kusema.js';

class KusemaConfig {
	constructor() {
		this.protocol = 'http';
		this.host = window.location.hostname;
		this.port = window.location.port;
	}
	get url() {
		return `${this.protocol}://${this.host}:${this.port}/`;
	}
	setFromJson(json) {
		if (json.protocol)
			this.protocol = json.protocol;
		if (json.host)
			this.host = json.host;
		if (json.port)
			this.port = json.port;
	}
	serverUrl(apiPoint) {
		return this.url+apiPoint;
	}
}

var kusemaConfig = new KusemaConfig();

var _waitForConfigDeferral = {
	resolve: null,
	reject: null,
}

var waitForConfig = new Promise(function(resolve, reject) {
	_waitForConfigDeferral.resolve = resolve;
	_waitForConfigDeferral.reject = reject;
})

var waitForConfig = System.import('../serverConfig.json!text')
.then(JSON.parse)
.catch( () => { return {} } )
.then( function(serverConfig) {
	kusemaConfig.setFromJson(serverConfig);
	_waitForConfigDeferral.resolve();
});

//kusema.value('kusemaConfig', kusemaConfig);
var serverUrl = kusemaConfig.serverUrl.bind(kusemaConfig);

export default kusemaConfig;
export {waitForConfig};
export {serverUrl};