'use strict';

import BaseJsonService from 'common/services/BaseJsonService.js';
var sanitizeJson = BaseJsonService.prototype.sanitizeJson;
import {serverUrl} from 'kusemaConfig.js';
import {Injector} from 'kusema.js';

var I = new Injector('$http', '$rootScope', '$q', 'groupService');

var LoginService = function() {
		I.init();
		this.bindables = {
			loginState: 0,
			user: null,
		};
		this.checkLogin();
		return this;
	}
	LoginService.prototype = Object.create(Object.prototype, {
		kusemaConfig: {value: null, writable: true},
	});
	LoginService.prototype.loginMonash = function() {
		return new Promise(function(resolve, reject) {
			this.casPopup = window.open(serverUrl('account/login_monash'), 'loginPopup', 'width=400', 'height=400');
			var loginMonashCallback = function(messageEvent) {
				if (messageEvent.origin !== window.location.origin) {
					console.error('event origin'+event.origin+' was not the same as this page: '+window.location.origin);
					reject();
				} else {
					console.log('monash login probably all good!');
					this.casPopup.close();
					this.checkLogin().then(resolve, reject);
				}
			}.bind(this);
			window.addEventListener('message', loginMonashCallback, false);
		}.bind(this));
	}
	LoginService.prototype.loginMonashComplete = function(messageEvent) {
	}
	LoginService.prototype.register = function(username, password) {
		var registerRequest = I.$http.post(serverUrl('account/register_local'), {'username': username, 'password': password})
		return registerRequest.then(
			function(response) {
				console.log('register request done');
			},
			function(error) {
				console.log('register error');
			}
		);
	};
	LoginService.prototype.login = function(username, password) {
		this.bindables.loginState = -1;
		return I.$http.post(
							serverUrl('account/login_local'),
							{'username': username, 'password': password}
						)
						.then( function(response) {
							console.log('logged in as '+response.data.username);
							return this.checkLogin();
						}.bind(this))
						.catch( function(error) {
							this.bindables.loginState = 0;
							return I.$q.reject(error);
						}.bind(this));
	};
	LoginService.prototype.logout = function() {
		var logoutRequest = I.$http.post(serverUrl('account/logout'));
		this.bindables.loginState = -2;
		return logoutRequest.then(
			function(response) {
				return this.checkLogin();
			}.bind(this),
			function(error) {
				console.error('logout error'+error.message);
			}.bind(this)
		);
	}
	LoginService.prototype.isLoggedIn = function() {
		return this.loggedIn;
	}
	LoginService.prototype.checkLogin = function() {
		var checkRequest = I.$http.get(serverUrl('account/is_logged_in'));
		return checkRequest.then(function(response) {
			if (response.data) {
				this.bindables.loginState = 1;
			} else {
				this.bindables.loginState = 0;
			}
			console.log(this.bindables);
			return this.populateUser(response.data);
		}.bind(this) )
		.then( function(user) {
			console.log('wat');
			console.log(this.bindables);
			I.$rootScope.$broadcast('loginChanged');
		}.bind(this) );
	}
	LoginService.prototype.populateUser = function(userData) {
		var user = userData;
		console.log('yay?');

		return I.groupService.waitForGroups
		.then( function() {
			if (!user) {
				return;
			}
			for (var subscriptions of [user.subscriptions, user.authcateSubscriptions, user.manualSubscriptions]) {
				subscriptions.groups = (subscriptions.groups)
									 ? I.groupService.getGroups(subscriptions.groups)
									 : [];
				subscriptions.topics = (subscriptions.topics)
								     ? I.groupService.getTopics(subscriptions.topics)
								     : [];
			}
		}.bind(this) )
		.catch( function(e) {
			console.error(e);
			console.error(e.stack);
		})
		.then( function() {
			this.bindables.user = user;
			return user;
		}.bind(this) );
	}

	LoginService.prototype.updateManualSubscriptions = function(manualSubscriptions) {
		var test = JSON.stringify(manualSubscriptions, sanitizeJson);
		return I.$http.put(serverUrl('api/user/')+this.bindables.user._id+'/manualSubscriptions',
							  JSON.stringify(manualSubscriptions, sanitizeJson))
		.then( response => this.populateUser(response.data) );
	}
//} loginService

import kusema from 'kusema.js';
kusema.service('loginService', LoginService);

export default LoginService;