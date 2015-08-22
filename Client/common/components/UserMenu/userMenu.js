var userMenuDirective = function() {
		return {
			scope: {},
			templateUrl: 'common/components/UserMenu/userMenuTemplate.html',
			replace: true,
			controller: 'kusemaUserMenuController',
			controllerAs: 'c'
		};
	};
//}
var userMenuController = function($scope, loginService) {
		this.$scope = $scope;
		this.originalEvent = null;
		this.loginService = loginService;
		return this;
	}
	userMenuController.prototype.openMenu = function(openMenuFunction, event) {
		this.originalEvent = event;
		openMenuFunction(event);
	}
	userMenuController.prototype.login = function() {
		console.log('login');
		this.loginService.login(this.data.username, this.data.password);
	}
	userMenuController.prototype.register = function() {
		console.log('register');
		this.loginService.register(this.data.username, this.data.password);
		this.loginService.login(this.data.username, this.data.password);
	}
kusema.addModule('kusema.components.userMenu')
		.directive('kusemaUserMenu', userMenuDirective)
		.controller('kusemaUserMenuController', ['$scope', 'loginService', userMenuController]);