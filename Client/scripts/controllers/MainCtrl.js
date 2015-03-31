'use strict';

var SearchCriteria = function() {
		return this;
	}
	SearchCriteria.prototype = Object.create(Object.prototype, {
		topic: {writable: true, value: null},
		name: {writable: true, value: null},
		date: {writable: true, value: null},
	})
// } SearchCriteria


var SearchController = function() {
		this.critera = new SearchCriteria();
		return this;
	}
	SearchController.prototype = Object.create(Object.prototype, {
		criteria: {writable: true, value: null}
	});
	SearchController.prototype.submit = function(form) {
		this.criteria = angular.copy(form); // Is this just a placeholder?
	}
// } SearchController


kusema.controller('SearchController',	SearchController);

var QuestionListController = function($scope, questionFactory) {
		this.$scope = $scope;
		this.qf = questionFactory;
		this.allowMoreRequests = true;
		this.writerOpen = false;
		this.questions = this.qf.questions;
	}
	QuestionListController.prototype = Object.create(Object.prototype, {
		allowMoreRequests: {writable: true, value: true},
		writerOpen: {writable: true, value: false}
	});
	QuestionListController.prototype.toggleWriter = function() {
		this.writerOpen = !this.writerOpen;
	}
	QuestionListController.prototype.addQuestion = function(formData) {
		var newQuestion = new Question(formData, this.qf);
		this.qf.addQuestion(newQuestion).
		success(
			function(response) {
				this.writerOpen = false;
				this.qf.questions.questionsList.push(response);
			}.bind(this)).
		error(
			function(response) {
				this.$scope.status = 'Unable to add question: ' + response.message;
			}.bind(this));
	}
// } QuestionListController

kusema.controller( 'QuestionListController', [ '$scope', 'questionFactory', QuestionListController ] );
