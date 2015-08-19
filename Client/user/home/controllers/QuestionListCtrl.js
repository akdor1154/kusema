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

var QuestionListController = function(questionFactory, $mdDialog) {
		this.allowMoreRequests = true;
		this.writerOpen = false;
		this.questions = questionFactory.questions;
		this.$mdDialog = $mdDialog;
		this.test = "hello";
	}

	QuestionListController.prototype.toggleWriter = function() {
		this.writerOpen = !$scope.writerOpen;
	}

	QuestionListController.prototype.showWriter = function(e) {
		console.log('asdf');
		this.$mdDialog.show({
			controller: 'AddQuestionDialogController',
			template: document.getElementById('addQuestionDialog').innerHTML,
			targetEvent: e,
			clickOutsideToClose: true
		}).then( function(answer) {
			console.log('yay');
		});
	}

	QuestionListController.prototype.addQuestion = function(formData) {
		questionFactory.addQuestion(newQuestion)
		.success(
			function(response) {
				this.writerOpen = false;
				questionFactory.questions.questionsList.push(response);
			}
		)
		.error(
			function(response) {
				this.status = 'Unable to add question: ' + response.message;
			}
		);
	}

kusema.controller( 'QuestionListController', ['questionFactory', '$mdDialog', QuestionListController ] );


var AddQuestionDialogController = function($scope) {
	$scope.$on('EDIT_CONTENT_FORM_SUBMITTED', function (e, message) {
		console.log('BED TIME!');
	});
	return this;
}
kusema.controller( 'AddQuestionDialogController', ['$scope', AddQuestionDialogController ] );
