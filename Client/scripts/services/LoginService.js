'use strict';

var LoginService = function($http, kusemaConfig) {
	
	var loginService = {};

	loginService.register = function(username, password) {
		console.log(username)
		var registerRequest = $http.post(kusemaConfig.url()+'account/register', {'username': username, 'password': password})
		registerRequest.success(function(data, status, headers, config) {
			console.log('register request done');
		});
		registerRequest.error(function(data, status, headers, config) {
			console.log('register error');
		});
	};

	loginService.login = function(username, password) {
		var loginRequest = $http.post(kusemaConfig.url()+'account/login', {'username': username, 'password': password})
		loginRequest.success(function(data, status, headers, config) {
			console.log('login request done');
		});
		loginRequest.error(function(data, status, headers, config) {
			console.log('login error');
		});
	};

	return loginService;
}

kusema.factory('loginService', ['$http', 'kusemaConfig', LoginService]);