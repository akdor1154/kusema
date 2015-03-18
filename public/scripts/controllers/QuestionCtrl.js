'use strict';

kusema.controller('QuestionCtrl', [
  	'$scope', 
  	'$routeParams', 
    'questionFactory',
    'commentFactory',
    'socketFactory',
    'toolboxFactory', 
  	function ($scope, $routeParams, questionFactory, commentFactory, socketFactory, toolboxFactory) {

    // Grab the question id from the route params
    var questionId = $routeParams.id;

    $scope.previousComments = [];

    // Retrieve previous comments
    commentFactory.getComments(questionId)
    .success(function (comm) {
      $scope.previousComments = comm;
      console.log($scope.previousComments);
    })
    .error(function (error) {
      console.log('Unable to load comments: ' + error.message);
    });
    

    // Holds the array of comment objects
    $scope.comments = [];


    // Tells socket.io that participant has entered the question's discussion page 
    socketFactory.emit('enter discussion', {
      username: 'bobby',
      question_id: questionId
    });

    // MAY NEED AN ON-LEAVE EVENT TOO? 

    socketFactory.on('new message', function (data) {
      if (data.question_id === questionId) {
        $scope.comments = $scope.comments.concat(data);
        if (messagerOpen === true) {
          $('html, body').animate({scrollTop:$(document).height()}, 'slow');  
        }      
        // socketFactory.emit('my other event', { my: 'data' });
      }
  });


    // Make an empty object for the edited question.
    $scope.editedQuestion = {};

    questionFactory.getQuestionById(questionId)
        .success(function (quest) {
            $scope.question = quest;
      			$scope.editedQuestion.title = $scope.question.title;
      			$scope.editedQuestion.author = $scope.question.author;
      			$scope.editedQuestion.comment = $scope.question.comment;
        })
        .error(function (error) {
            $scope.status = 'Unable to load questions: ' + error.message;
        });


      $scope.updateQuestion = function() {
        questionFactory.updateQuestion($scope.editedQuestion)
          .success(function () {
          	console.log($scope.editedQuestion);
      			$scope.question.title = $scope.editedQuestion.title;
      			$scope.question.author = $scope.editedQuestion.author;
      			$scope.question.comment = $scope.editedQuestion.comment;

            var searchResults = toolboxFactory.findObjectInArray(
                      questionFactory.questions.questionList,
                      '_id',
                      questionId
                    );
                    searchResults.referenceToObject.title = $scope.editedQuestion.title;
                    searchResults.referenceToObject.author = $scope.editedQuestion.author;
                    searchResults.referenceToObject.comment = $scope.editedQuestion.comment;


        		$scope.status = 'Question uploaded';
          })
          .error(function (error) {
			$scope.status = 'Unable to load questions: ' + error.message;
          });
      };



  $scope.addComment = function () {
    if ($scope.newComment !== '') {
      // Save comment to database
      var message = {
        question_id: questionId,
        author: 'sherbinator2014 ',
        message: $scope.newComment
      };
      $('html, body').animate({scrollTop:$(document).height() - 1}, 'slow');
      commentFactory.addComment(questionId, message);
      socketFactory.emit('message sent', message);
      $scope.comments = $scope.comments.concat(message);
      // console.log('sent- ' + $scope.newComment);
      // console.log($scope.comments);
      $scope.newComment = '';
    }
  };


$scope.deleteComment = function(commentId) {
  commentFactory.deleteComment(commentId);
  var index = -1;

  index = toolboxFactory.findObjectInArray(
    $scope.comments,
    '_id',
    commentId
    ).objectPosition;
  if(index !== -1) {
      $scope.comments.splice(index, 1);
  } else {
    index = toolboxFactory.findObjectInArray(
      $scope.previousComments,
      '_id',
      commentId
      ).objectPosition;
      if (index !== -1) {
          $scope.previousComments.splice(index, 1);
      }
  }
};



    var sendOnEnter = true;
    $('.reply-box').on('keydown', function(e) {
        if (e.which === 13) {
            if (sendOnEnter) {            
              e.preventDefault();
              $scope.$apply($scope.addComment());
            }
        }
    });

    var messagerOpen = false;

    var closeWriter = function () {
        messagerOpen = false;
        $('.messager').animate({bottom:'-145px'}, 200);
        $('.contribute').animate({bottom:'55px', right:'90px', opacity: 1}, 200);
        $('#cross').css({'-webkit-transform' : 'rotate('+ 0 +'deg)',
         '-moz-transform' : 'rotate('+ 0 +'deg)',
         '-ms-transform' : 'rotate('+ 0 +'deg)',
         'transform' : 'rotate('+ 0 +'deg)'});
    };

    var openWriter = function () {
        messagerOpen = true;
        $('.messager').animate({bottom:'0px'}, 200);
        $('.contribute').animate({bottom:'155px', right:'50%', opacity: 1}, 200);
        $('#cross').css({'-webkit-transform' : 'rotate('+ 45 +'deg)',
         '-moz-transform' : 'rotate('+ 45 +'deg)',
         '-ms-transform' : 'rotate('+ 45 +'deg)',
         'transform' : 'rotate('+ 45 +'deg)'});
    };

    $('.contribute').click(function(){
      if (messagerOpen) {
        closeWriter();
      } else {
        openWriter();
      }
    });  



  }]);
