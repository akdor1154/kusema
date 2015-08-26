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

var QuestionListDirective = function() {
	return {
		scope: {
			'group': '='
		},
		templateUrl: 'user/questionList/questionListTemplate.html',
		controller: 'questionListController',
		controllerAs: 'c'
	};
}

var QuestionListController = function(questionFactory, $mdDialog) {
		this.allowMoreRequests = true;
		this.writerOpen = false;
		this.questions = questionFactory.questions;
		this.$mdDialog = $mdDialog;
		this.test = "hello";
	}


	QuestionListController.prototype.showWriter = function(e) {
		console.log('asdf');
		this.$mdDialog.show({
			template: document.getElementById('addQuestionDialog').innerHTML,
			targetEvent: e,
			clickOutsideToClose: true
		}).then( function(answer) {
			console.log('yay');
		}, function(error) {
			console.log('umm');
		});
	}
	QuestionListController.prototype.hideWriter = function() {
		this.$mdDialog.hide();
	}

kusema.addModule('kusema.user.questionList', ['ngMaterial'] )
	  .directive('kusemaQuestionList', QuestionListDirective)
	  .controller('questionListController', ['questionFactory', '$mdDialog', QuestionListController])
