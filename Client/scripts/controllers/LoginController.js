'use strict'

var LoginController = function($scope, loginService) {
		this.$scope = $scope;
		this.loginService = loginService;
		this.loginForm = $('loginForm');
	}
	LoginController.prototype = Object.create(Object.prototype, {
		$scope: {writable: true, value: null},
		loginService: {writable: true, value: null},
		username: {writable: true, value: null},
		password: {writable: true, value: null }
	});
	LoginController.prototype.processLogin = function() {
		console.log('hello from login');
		this.loginService.login(this.username, this.password);
	}
	LoginController.prototype.processRegister = function() {
		this.loginService.register(this.username, this.password);
	}
//} LoginController


kusema.controller('loginController', ['$scope', '$http', 'loginService', LoginController]);