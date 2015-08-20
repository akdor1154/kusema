var MainController = function($scope, $mdSidenav, $state) {

	$state.go('user');

	$scope.toggleSidenav = function(menuId) {
		$mdSidenav(menuId).toggle();
	}

};

kusema.controller( 'MainController', [ '$scope', '$mdSidenav', '$state', MainController ] );
