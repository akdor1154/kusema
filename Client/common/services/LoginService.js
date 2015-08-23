'use strict';

var LoginService = function($http, $rootScope, kusemaConfig) {
		this.$rootScope = $rootScope;
		this.$http = $http;
		this.kusemaConfig = kusemaConfig;
		this.username = null;
		this.loggedIn = false;
		this.checkLogin();
		return this;
	}
	LoginService.prototype = Object.create(Object.prototype, {
		kusemaConfig: {value: null, writable: true},
	});
	LoginService.prototype.register = function(username, password) {
		var registerRequest = this.$http.post(this.kusemaConfig.url()+'account/register_local', {'username': username, 'password': password})
		registerRequest.success(function(data, status, headers, config) {
			console.log('register request done');
		});
		registerRequest.error(function(data, status, headers, config) {
			console.log('register error');
		});
	};
	LoginService.prototype.login = function(username, password) {
		var loginRequest = this.$http.post(this.kusemaConfig.url()+'account/login_local', {'username': username, 'password': password})
		loginRequest.success(function(data, status, headers, config) {
			console.log('login request done');
			this.username = username;
			this.checkLogin();
			//TODO: signal we have logged in to any controllers that want to know
		}.bind(this));
		loginRequest.error(function(data, status, headers, config) {
			console.log('login error');
		});
	};
	LoginService.prototype.logout = function() {
		var logoutRequest = this.$http.post(this.kusemaConfig.url()+'account/logout');
		logoutRequest.then(
			function(response) {
				console.log('logout done');
				this.checkLogin();
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
		checkRequest.then(function(response) {
			if (response.data) {
				this.loggedIn = true;
				console.log('we\'re in!');
			} else {
				this.loggedIn = false;
				console.log('we\'re out!');

			}
			this.$rootScope.$broadcast('loginChanged');
		}.bind(this));
	}
//} loginService

kusema.service('loginService', ['$http', '$rootScope', 'kusemaConfig', LoginService]);