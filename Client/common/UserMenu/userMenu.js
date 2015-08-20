var userMenuDirective = function() {
		return {
			scope: {},
			templateUrl: 'common/UserMenu/userMenuTemplate.html',
			replace: true,
			controller: 'kusemaUserMenuController',
			controllerAs: 'c'
		};
	};
//}
var userMenuController = function($scope) {
		this.$scope = $scope;
		this.originalEvent = null;
		return this;
	}
	userMenuController.prototype.openMenu = function(openMenuFunction, event) {
		this.originalEvent = event;
		openMenuFunction(event);
	}
	
angular.module('kusema.userMenu', [])
		.directive('kusemaUserMenu', userMenuDirective)
		.controller('kusemaUserMenuController', userMenuController);