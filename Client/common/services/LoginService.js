'use strict';

var LoginService = function($http, $rootScope, kusemaConfig) {
		this.$rootScope = $rootScope;
		this.$http = $http;
		this.kusemaConfig = kusemaConfig;
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
			this.casPopup = window.open('/account/login_monash', 'loginPopup', 'width=400', 'height=400');
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
		var registerRequest = this.$http.post(this.kusemaConfig.url()+'account/register_local', {'username': username, 'password': password})
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
		return this.$http.post(
							this.kusemaConfig.url()+'account/login_local',
							{'username': username, 'password': password}
						)
						.then( function(response) {
							console.log('login request done');
							return this.checkLogin();
						}.bind(this))
						.catch( function(error) {
							this.loginState = 0;
							console.log('login error');
						}.bind(this));
	};
	LoginService.prototype.logout = function() {
		var logoutRequest = this.$http.post(this.kusemaConfig.url()+'account/logout');
		this.bindables.loginState = -2;
		return logoutRequest.then(
			function(response) {
				console.log('logout done');
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
		var checkRequest = this.$http.get(this.kusemaConfig.url()+'account/is_logged_in');
		return checkRequest.then(function(response) {
			if (response.data) {
				this.bindables.loginState = 1;
				console.log('we\'re in!');
			} else {
				this.bindables.loginState = 0;
				console.log('we\'re out!');
			}
			this.bindables.user = response.data;
			this.$rootScope.$broadcast('loginChanged');
		}.bind(this));
	}
//} loginService

kusema.service('loginService', ['$http', '$rootScope', 'kusemaConfig', LoginService]);