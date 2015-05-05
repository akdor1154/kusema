'use strict';

var newAreaController = function($scope, areaFactory, $mdSidenav) {
	$scope.inputData = {
		title: ''
	};
	$scope.addArea = function(formData) {
		areaFactory.addArea(formData)
			.success(
				function(response) {
					$scope.writerOpen = false;
					areaFactory.areas.areasList.push(response);
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

kusema.controller( 'newAreaController', [ '$scope', 'areaFactory', '$mdSidenav', newAreaController ] );