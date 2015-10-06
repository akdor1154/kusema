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

import questionListTemplate from './questionListTemplate.html'

var QuestionListDirective = function() {
	return {
		scope: {},
		bindToController: {
			'group': '='
		},
		template: questionListTemplate,
		controller: 'questionListController',
		controllerAs: 'c'
	};
}

var QuestionListController = function(questionService, $mdDialog, $scope) {
		this.allowMoreRequests = true;
		this.writerOpen = false;
		this.$scope = $scope;
		this.$mdDialog = $mdDialog;
		this.test = "hello";
		this.questions = []

	    questionService.getFeed(0, this.group)
	    .then( this.addQuestions.bind(this) )
	    .catch( console.error.bind(console) );

	}

	QuestionListController.prototype.addQuestions = function(questions) {
		//TODO: infinite scroll?
		this.questions = questions;
	}


	QuestionListController.prototype.showWriter = function(e) {
		console.log('asdf');
		this.$mdDialog.show({
			controller: function Dummy() {},
			controllerAs: 'dc',
			template: document.getElementById('addQuestionDialog').innerHTML,
			targetEvent: e,
			clickOutsideToClose: true,
			scope: this.$scope.$new(),
		}).then( function(answer) {
			console.log('yay');
		}, function(error) {
			console.log('umm');
		});
	}
	QuestionListController.prototype.hideWriter = function() {
		this.$mdDialog.hide();
	}
	QuestionListController.prototype.newQuestionPosted = function(newQuestion) {
		this.questions.unshift(newQuestion);
		this.hideWriter();
	}

import {addModule} from 'kusema.js';

addModule('kusema.user.questionList', ['ngMaterial'] )
	  .directive('kusemaQuestionList', QuestionListDirective)
	  .controller('questionListController', ['questionService', '$mdDialog', '$scope', QuestionListController])
