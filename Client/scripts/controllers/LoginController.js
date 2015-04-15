'use strict'

var LoginController = function($scope, loginService) {
	$scope.login = loginService.login
	$scope.register = loginService.register;
}

kusema.controller('LoginController', ['$scope', 'loginService', LoginController]);