'use strict';

// var SearchCriteria = function() {
// 		return this;
// 	}
// 	SearchCriteria.prototype = Object.create(Object.prototype, {
// 		topic: {writable: true, value: null},
// 		name: {writable: true, value: null},
// 		date: {writable: true, value: null},
// 	})
// // } SearchCriteria


// var SearchController = function() {
// 		this.critera = new SearchCriteria();
// 		return this;
// 	}
// 	SearchController.prototype = Object.create(Object.prototype, {
// 		criteria: {writable: true, value: null}
// 	});
// 	SearchController.prototype.submit = function(form) {
// 		this.criteria = angular.copy(form); // Is this just a placeholder?
// 	}
// // } SearchController


//kusema.controller('SearchController', SearchController);

var QuestionListController = function($scope, questionFactory, $mdSidenav) {
	$scope.allowMoreRequests = true;
	$scope.writerOpen = false;
	$scope.questions = questionFactory.questions;

	$scope.test = "hello";

	$scope.toggleWriter = function() {
		$scope.writerOpen = !$scope.writerOpen;
	}

	$scope.addQuestion = function(formData) {
		questionFactory.addQuestion(newQuestion)
		.success(
			function(response) {
				$scope.writerOpen = false;
				questionFactory.questions.questionsList.push(response);
			}
		)
		.error(
			function(response) {
				$scope.status = 'Unable to add question: ' + response.message;
			}
		);
	}
};

kusema.controller( 'QuestionListController', [ '$scope', 'questionFactory', '$mdSidenav', QuestionListController ] );
