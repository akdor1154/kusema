'use strict';

var needsLoginDirective = function() {
	var linkFunction = function(scope, element, attributes) {
		scope.c.needsLogin = !(attributes['kusemaNeedsLogin']=="false");

		scope.$watch('c.needsLogin == (c.loginData.loginState == 1)', function(show, oldShow) {
			console.log(scope);
			if (show) {
				element.removeClass('ng-hide');
			} else {
				element.addClass('ng-hide');
			}
		});
	};
	var compileFunction = function(element, attributes) {
	}
	return {
		scope: {},
		restrict: 'A',
		replace: false,
		link: linkFunction,
		controller: 'needsLoginController',
		controllerAs: 'c',
		priority: 1
	};
}

var needsLoginController = function(loginService) {
		this.loginData = loginService.bindables;
	}
	needsLoginController.prototype = Object.create(Object.prototype, {
		'needsLogin': {writable: true, enumerable: false, default: true}
	});

kusema.user.directive('kusemaNeedsLogin', needsLoginDirective)
		   .controller('needsLoginController', ['loginService', needsLoginController]);