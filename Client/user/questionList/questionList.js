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

		this.$mdDialog = $mdDialog;
		this.test = "hello";
		
		this.questions = {
	      numberOfRequestsForQuestions: 1,
	      questionsList: [],
	      add: function(responseJSON) {
	        this.questionsList.push(questionFactory.createClientModel(responseJSON));
	      },
	      addQuestions: function(questions) {
	        this.questionsList = questions;
	      },
	      delete: function(id) {
	        var questionIndex = this.getIndexOf(id);
	        if (questionIndex) {
	            this.questionsList.splice(questionIndex, 1);
	        }
	      },
	      getIndexOf: function(id) {
	        var possibleQuestions = this.questionsList.filter(function(question) {return question._id == id;});
	        if (possibleQuestions.length > 0) {
	            return possibleQuestions[0]
	        } else {
	            return null;
	        }
	      }
	    };

	    questionFactory.getNextTenQuestions(0)
	    .then(
	        function (quest) {
	            this.questions.addQuestions(quest);
	        }.bind(this),
	        function (error) {
	            console.error('Unable to load questions: ' + error + error.message);
	        }
	    );

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
	  .controller('questionListController', ['questionService', '$mdDialog', QuestionListController])
