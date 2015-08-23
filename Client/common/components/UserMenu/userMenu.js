var userMenuDirective = function() {
		return {
			scope: {
				'loggedIn': '=',
			},
			templateUrl: 'common/components/UserMenu/userMenuTemplate.html',
			controller: 'kusemaUserMenuController',
			controllerAs: 'c'
		};
	};
//}
var userMenuController = function($scope, loginService) {
		this.$scope = $scope;
		this.originalEvent = null;
		this.loginService = loginService;
		$scope.$on('loginChanged', function(event) {
			console.log('got login');
			$scope.loggedIn = loginService.isLoggedIn() ? "true" : "false";
		});
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
	userMenuController.prototype.logout = function() {
		console.log('logout');
		this.loginService.logout();
	}



var userMenuNotLoggedInDirective = function() {
	return {
		scope: true,
		templateUrl: 'common/components/UserMenu/notLoggedInTemplate.html'
	};
};

var userMenuLoggedInDirective = function() {
	return {
		scope: true,
		templateUrl: 'common/components/UserMenu/loggedInTemplate.html'
	}
}


kusema.addModule('kusema.components.userMenu')
		.directive('kusemaUserMenu', userMenuDirective)
		.controller('kusemaUserMenuController', ['$scope', 'loginService', userMenuController])
		.directive('kusemaUserMenuNotLoggedIn', userMenuNotLoggedInDirective)
		.directive('kusemaUserMenuLoggedIn', userMenuLoggedInDirective);
