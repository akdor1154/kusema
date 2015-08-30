var userMenuDirective = function() {
		return {
			templateUrl: 'common/components/UserMenu/userMenuTemplate.html',
			controller: 'kusemaUserMenuController',
			controllerAs: 'c'
		};
	};
//}
var userMenuController = function($scope, loginService, $mdBottomSheet) {
		this.$scope = $scope;
		this.$mdBottomSheet = $mdBottomSheet;
		this.originalEvent = null;
		this.loginService = loginService;
		this.loginData = loginService.bindables;
		return this;
	}
	userMenuController.prototype.openMenu = function(openMenuFunction, event) {
		this.originalEvent = event;
		openMenuFunction(event);
	}
	userMenuController.prototype.loginMonash = function() {
		this.loginService.loginMonash();
	}
	userMenuController.prototype.login = function() {
		console.log('login');
		this.loginService.login(this.data.username, this.data.password);
	}
	userMenuController.prototype.register = function() {
		console.log('register');
		this.loginService.register(this.data.username, this.data.password)
		.then(function(registration) {
			this.loginService.login(this.data.username, this.data.password);
		}.bind(this));
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
		.controller('kusemaUserMenuController', ['$scope', 'loginService', '$mdBottomSheet', userMenuController])
		.directive('kusemaUserMenuNotLoggedIn', userMenuNotLoggedInDirective)
		.directive('kusemaUserMenuLoggedIn', userMenuLoggedInDirective);
