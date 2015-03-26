'use strict';

var LoginService = function(kusemaConfig) {
		this.kusemaConfig = kusemaConfig;
		return this;
	}
	LoginService.prototype = Object.create(Object.prototype, {
		kusemaConfig: {value: null, writable: true},
	});
	LoginService.prototype.register = function(username, password) {
		var registerRequest = $http.post(this.kusemaConfig.url()+'/account/register', {'username': username, 'password': password}).
		registerRequest.success(function(data, status, headers, config) {
			console.log('register request done');
		});
		registerRequest.error(function(data, status, headers, config) {
			console.log('register error');
		});
	};
	LoginService.prototype.login = function(username, password) {
		var loginRequest = $http.post(this.kusemaConfig.url()+'/account/login', {'username': username, 'password': password}).
		loginrequst.success(function(data, status, headers, config) {
			console.log('login request done');
		});
		loginRequest.error(function(data, status, headers, config) {
			console.log('login error');
		});
	};
//} loginService

kusema.service('loginService', ['kusemaConfig', LoginService]);