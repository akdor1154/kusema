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
					this.allowMoreRequests = true;
					this.writerOpen = false;
					
					tmp.me.questions = questionFactory.questions;
					
					tmp.me.getScore = function(data) {
						return -(data.upVotes - data.downVotes);
					}
					
					tmp.me.upVote = function(id, btn) {
				    	tmp.search = toolboxFactory.findObjectInArray(tmp.me.questions.questionList, '_id', id);
				    	if(tmp.search.objectPosition !== -1) {
				    		tmp.search.referenceToObject.upVotes++;
				    		questionFactory.upVoteQuestion(id);
				    	} else {alert('Invalid Question. (id: ' + id + ')')}
				    }
				    
					tmp.me.downVote = function(id) {
				    	tmp.search = toolboxFactory.findObjectInArray(tmp.me.questions.questionList, '_id', id);
				    	if(tmp.search.objectPosition !== -1) {
				    		tmp.search.referenceToObject.downVotes++;
				    		questionFactory.dnVoteQuestion(id);
				    	} else {alert('Invalid Question. (id: ' + id + ')')}
				    }
				    
					tmp.me.deleteQuestion = function(id) {
				    	tmp.search = toolboxFactory.findObjectInArray(tmp.me.questions.questionList, '_id', id);
				    	if(tmp.search.objectPosition !== -1) {
				    		tmp.me.questions.questionList.splice(tmp.search.objectPosition, 1);
				    		questionFactory.deleteQuestion(id);
				    	} else {alert('Invalid Question. (id: ' + id + ')')}
				    }
				    
					tmp.me.closeWriter = function () {
						tmp.me.writerOpen = false;
				        $('.writer').animate({bottom:'-145px'}, 200);
				        $('.contribute').animate({bottom:'55px', right:'90px', opacity: 1}, 200);
				        $('#cross').css({'-webkit-transform' : 'rotate('+ 0 +'deg)',
				         '-moz-transform' : 'rotate('+ 0 +'deg)',
				         '-ms-transform' : 'rotate('+ 0 +'deg)',
				         'transform' : 'rotate('+ 0 +'deg)'});
				    };

				    tmp.me.openWriter = function () {
				    	tmp.me.writerOpen = true;
				        $('.writer').animate({bottom:'0px'}, 200);
				        $('.contribute').animate({bottom:'155px', right:'50%', opacity: 1}, 200);
				        $('#cross').css({'-webkit-transform' : 'rotate('+ 45 +'deg)',
				         '-moz-transform' : 'rotate('+ 45 +'deg)',
				         '-ms-transform' : 'rotate('+ 45 +'deg)',
				         'transform' : 'rotate('+ 45 +'deg)'});
				    };
				    
				    tmp.me.addQuestion = function (data) {
				    	tmp.newPost = {};
				    	tmp.newPost.title = data.title;
				        tmp.newPost.author = data.author;
				        tmp.newPost.message = data.message;
				        questionFactory.addQuestion(tmp.newPost).success(
						function(response) {
							tmp.me.closeWriter();
							tmp.me.questions.questionList.push(response);
						}).error(
						function(error) {
							$scope.status = 'Unable to add question: ' + error.message;
						});
				    }
				} ])			
;
