'use strict';

var newQuestionController = function($scope, questionFactory, $mdSidenav) {
	$scope.inputData = {
		title: '',
		author: '',
		message: ''
	};
	$scope.addQuestion = function(formData) {
		questionFactory.addQuestion(formData)
			.success(
				function(response) {
					$scope.writerOpen = false;
					questionFactory.questions.questionsList.push(response);
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

kusema.controller( 'newQuestionController', [ '$scope', 'questionFactory', '$mdSidenav', newQuestionController ] );