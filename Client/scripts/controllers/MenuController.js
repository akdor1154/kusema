var MainController = function($scope, $mdSidenav) {

	$scope.toggleSidenav = function(menuId) {
		$mdSidenav(menuId).toggle();
	}

};

kusema.controller( 'MainController', [ '$scope', '$mdSidenav', MainController ] );
