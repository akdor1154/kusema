'use strict';

var newUnitController = function($scope, unitFactory, $mdSidenav) {
	$scope.inputData = {
		title: '',
		code: ''
	};
	$scope.addUnit = function(formData) {
		unitFactory.addUnit(formData)
			.success(
				function(response) {
					$scope.writerOpen = false;
					unitFactory.units.unitsList.push(response);
					console.debug(response);
					self.close();
				}
			)
			.error(
				function(response) {
					$scope.status = 'Unable to add question: ' + response.message;
				}
			);
	};
};

kusema.controller( 'newUnitController', [ '$scope', 'unitFactory', '$mdSidenav', newUnitController ] );