'use strict';

kusema

.controller(
		'SearchController',
		[ '$scope', '$routeParams', '$timeout', 'questionFactory',
				'toolboxFactory', function($scope, $routeParams, $timeout, questionFactory, toolboxFactory) {
					$scope.criteria = {};
					
					$scope.submit = function(form) {
						$scope.criteria = angular.copy(form);
					};
				} ])
.controller(
		'QuestionListController',
		[ '$scope', '$routeParams', '$timeout', 'questionFactory',
				'toolboxFactory', function($scope, $routeParams, $timeout, questionFactory, toolboxFactory) {
					var tmp = {};
				    tmp.me = this;
				    
					tmp.allowMoreRequests = true; 
					
					tmp.me.questions = questionFactory.questions;
					console.debug(tmp.me.questions);
				    
				    this.upVote = function(id) {
				    	tmp.search = toolboxFactory.findObjectInArray(tmp.me.questions.questionList, '_id', id);
				    	if(tmp.search.objectPosition !== -1) {
				    		tmp.search.referenceToObject.upVotes++;
				    		questionFactory.upVoteQuestion(id);
				    	} else {alert('Invalid Question. (id: ' + id + ')')}
				    }
				    
				    this.downVote = function(id) {
				    	tmp.search = toolboxFactory.findObjectInArray(tmp.me.questions.questionList, '_id', id);
				    	if(tmp.search.objectPosition !== -1) {
				    		tmp.search.referenceToObject.downVotes++;
				    		questionFactory.dnVoteQuestion(id);
				    	} else {alert('Invalid Question. (id: ' + id + ')')}
				    }
				    
				    this.deleteQuestion = function(id) {
				    	tmp.search = toolboxFactory.findObjectInArray(tmp.me.questions.questionList, '_id', id);
				    	if(tmp.search.objectPosition !== -1) {
				    		tmp.me.questions.questionList.splice(tmp.search.objectPosition, 1);
				    		questionFactory.deleteQuestion(id);
				    	} else {alert('Invalid Question. (id: ' + id + ')')}
				    }
				    
				} ])			
				
;
