'use strict';

var newCommentController = function($scope, $routeParams, commentFactory, socketFactory, $mdSidenav) {
	$scope.questionId = $routeParams.id;
	$scope.inputData = {
		author: '',
		message: ''
	};
    
	$scope.addComment = function(formData) {
		console.debug($routeParams.id);
		console.debug(formData);
		commentFactory.addComment($routeParams.id, formData)
			.success(
				function(response) {
					console.debug(response);
				}
			)
			.error(
				function(response) {
					$scope.status = 'Unable to add question: ' + response.message;
				}
			);
	};
};

kusema.controller( 'newCommentController', [ '$scope', '$routeParams', 'commentFactory', 'socketFactory', '$mdSidenav',  newCommentController ] );