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
import {Injector} from 'kusema.js';

var QuestionListDirective = function() {
	return {
		scope: {},
		bindToController: {
			'group': '='
		},
		template: questionListTemplate,
		controller: 'questionListController',
		css: 'lib/user/questionList/questionList.css',
		controllerAs: 'c',
		link: function(scope, element, attrs) {
			element.parent().bind('scroll', function(event) {
				var content = event.target
				window.requestAnimationFrame(function() {
					if (content.scrollHeight - content.scrollTop - content.clientHeight < 80) { // pixels to bottom
						scope.c.getNextPage();
					}		
				})
			});
		}
	};
}

var I = new Injector('questionService', '$state');

var QuestionListController = function($mdDialog, $scope) {
		I.init();
		this.allowMoreRequests = true;
		this.writerOpen = false;
		this.$scope = $scope;
		this.$mdDialog = $mdDialog;
		this.init();
		console.log('kusema user group:');
		console.log(this.group);
		$scope.$on('loginChanged', this.init.bind(this));
	}

	QuestionListController.prototype.init = function() {
		this.questions = []
		this.requestNumber = 0;
		this.requesting = false;
		this.noMore = false

		this.getNextPage();
	}

	QuestionListController.prototype.getNextPage = function() {
		if (this.requesting || this.noMore)
			return;
		console.log(I.$state);
		this.requesting = true;

		var g = I.questionService.getFeed(this.requestNumber, this.group)
		.then( (questions) => {
			this.addQuestions(questions);
		} )
		.catch( (error) => {
			this.noMore = true;
		})
		.then( () => { console.log('done!'); this.requesting = false;});

		this.requestNumber++;

		return g;
	}

	QuestionListController.prototype.addQuestions = function(questions) {
		this.questions.push(...questions);
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
	  .controller('questionListController', ['$mdDialog', '$scope', QuestionListController])
