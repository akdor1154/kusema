'use strict';

/*global $ */

/**
 * @ngdoc function
 * @name forumApp.controller:NewQuestionCtrl
 * @description
 * # NewQuestionCtrl
 * Controller of the forumApp
 */
kusema.controller('NewQuestionCtrl', [
   '$scope',
   '$routeParams',
   'questionFactory',
   function ($scope, $routeParams, questionFactory) {

    var writerOpen = false;

    var closeWriter = function () {
        writerOpen = false;
        $('.writer').animate({bottom:'-145px'}, 200);
        $('.contribute').animate({bottom:'55px', right:'90px', opacity: 1}, 200);
        $('#cross').css({'-webkit-transform' : 'rotate('+ 0 +'deg)',
         '-moz-transform' : 'rotate('+ 0 +'deg)',
         '-ms-transform' : 'rotate('+ 0 +'deg)',
         'transform' : 'rotate('+ 0 +'deg)'});
    };

    var openWriter = function () {
        writerOpen = true;
        $('.writer').animate({bottom:'0px'}, 200);
        $('.contribute').animate({bottom:'155px', right:'50%', opacity: 1}, 200);
        $('#cross').css({'-webkit-transform' : 'rotate('+ 45 +'deg)',
         '-moz-transform' : 'rotate('+ 45 +'deg)',
         '-ms-transform' : 'rotate('+ 45 +'deg)',
         'transform' : 'rotate('+ 45 +'deg)'});
    };

    $('.contribute').click(function(){
      if (writerOpen) {
        closeWriter();
      } else {
        openWriter();
      }

    });  

    $scope.addQuestion = function() {
      questionFactory.addQuestion($scope.newPost)
      .success(function () {
        closeWriter();
        $scope.newPost.title = '';
        $scope.newPost.author = '';
        $scope.newPost.comment = '';
      })
      .error(function (error) {
        $scope.status = 'Unable to load questions: ' + error.message;
      });
    };
  }]);