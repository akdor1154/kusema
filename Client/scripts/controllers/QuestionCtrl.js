'use strict';
kusema

.controller(
		'QuestionController',
		[ '$scope', '$routeParams', '$timeout', 'questionFactory', 'commentFactory',
				'toolboxFactory', function($scope, $routeParams, $timeout, questionFactory, commentFactory, toolboxFactory) {
					var tmp = {};
					tmp.me = this;
					tmp.me.questionEditorOpen = false;
					tmp.me.button = {'text': 'Edit', 'class': 'btn btn-success', 'disabled': false};
					
					questionFactory.getQuestionById($routeParams.id)
						.success(function(data) {
							tmp.me.question = data;
							tmp.me.questionForm = {'title': data.title, 'message': data.message};
						})
						.error(function(error) {
							console.log('Invalid question ID passed in (id=' + routeParams.id + '): '+ error.message);
							alert('Invalid question ID passed in (id=' + routeParams.id + '): '+ error.message);
						});
					
					tmp.me.editQuestion = function() {
						if(tmp.me.questionForm.title !== tmp.me.question.title || tmp.me.questionForm.message !== tmp.me.question.message) {
							tmp.me.button.disabled = true;
							tmp.me.button.text = 'loading ...';
							questionFactory.updateQuestion(tmp.me.questionForm)
								.success(function(data) {
									tmp.me.button.disabled = false;
									tmp.me.button.text = 'Edit';
									tmp.me.question.title = tmp.me.questionForm.title;
									tmp.me.question.message = tmp.me.questionForm.message;
								})
								.error(function(error) {
									console.debug('Error saving question (id=' + $routeParams.id + '). ' + error.message);
									alert('Error saving question (id=' + $routeParams.id + '). ' + error.message);
								});
						}
					};
} ])

.controller(
		'CommentController',
		[ '$scope', '$routeParams', '$timeout', 'questionFactory', 'commentFactory', 'socketFactory', 'toolboxFactory', 
		  function($scope, $routeParams, $timeout, questionFactory, commentFactory, socketFactory, toolboxFactory) {
				var tmp = {};
				tmp.me = this;
				tmp.me.comments = [];
				tmp.me.messagerOpen = false;
				tmp.me.newComment = '';
				
				commentFactory.getComments($routeParams.id)
					.success(function(data) {
						tmp.me.comments = data;
					})
					.error(function(error) {
						console.log('Unable to load comments: '+ error.message);
						alert('Unable to load comments: '+ error.message);
					});
				
				tmp.me.deleteComment = function(id) {
			    	tmp.search = toolboxFactory.findObjectInArray(tmp.me.comments, '_id', id);
			    	if(tmp.search.objectPosition !== -1) {
			    		tmp.me.comments.splice(tmp.search.objectPosition, 1);
			    		commentFactory.deleteComment(id);
			    	} else {alert('Invalid Comment. (id: ' + id + ')')}
			    }
				

			    tmp.me.closeWriter = function () {
			    	tmp.me.messagerOpen = false;
			        $('.messager').animate({bottom:'-145px'}, 200);
			        $('.contribute').animate({bottom:'55px', right:'90px', opacity: 1}, 200);
			        $('#cross').css({'-webkit-transform' : 'rotate('+ 0 +'deg)',
			         '-moz-transform' : 'rotate('+ 0 +'deg)',
			         '-ms-transform' : 'rotate('+ 0 +'deg)',
			         'transform' : 'rotate('+ 0 +'deg)'});
			    };

			    tmp.me.openWriter = function () {
			    	tmp.me.messagerOpen = true;
			        $('.messager').animate({bottom:'0px'}, 200);
			        $('.contribute').animate({bottom:'155px', right:'50%', opacity: 1}, 200);
			        $('#cross').css({'-webkit-transform' : 'rotate('+ 45 +'deg)',
			         '-moz-transform' : 'rotate('+ 45 +'deg)',
			         '-ms-transform' : 'rotate('+ 45 +'deg)',
			         'transform' : 'rotate('+ 45 +'deg)'});
			    };
			    
			    tmp.me.addComment = function () {
			        if (tmp.me.newComment !== '') {
			          // Save comment to database
			          var message = {
			            question_id: $routeParams.id,
			            author: 'sherbinator2014 ',
			            message: tmp.me.newComment
			          };
			          $('html, body').animate({scrollTop:$(document).height() - 1}, 'slow');
			          commentFactory.addComment($routeParams.id, message);
			          socketFactory.emit('message sent', message);
			          tmp.me.comments = tmp.me.comments.concat(message);
			          tmp.me.newComment = '';
			          tmp.me.closeWriter();
			        }
			      };
} ])
;