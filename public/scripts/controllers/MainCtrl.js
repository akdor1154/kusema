'use strict';

kusema.controller('MainCtrl', [
   '$scope',
   '$routeParams',
   '$timeout',
   'questionFactory',
   'toolboxFactory',
   function ($scope, $routeParams, $timeout, questionFactory, toolboxFactory) {

    var allowMoreRequests = true; 

    $scope.questions = questionFactory.questions;

    toolboxFactory.scrollMax(function(){

  	// $apply runs the 'digest loop'
    if (allowMoreRequests === true){

      allowMoreRequests = false;

      $scope.$apply(function() {

        questionFactory.getNextTenQuestions(questionFactory.questions.numberOfRequestsForQuestions)
        .success(function (quest) {
          questionFactory.questions.questionList = questionFactory.questions.questionList.concat(quest);
          questionFactory.questions.numberOfRequestsForQuestions++; 
          $timeout(function (){ allowMoreRequests = true; }, 500);
        })
        .error(function (error) {
          $scope.status = 'Unable to load questions: ' + error.message;
        });
      });
    }
  });



  $scope.deleteQuestion = function(id) {
    questionFactory.deleteQuestion(id);
    var index = toolboxFactory.findObjectInArray(
      questionFactory.questions.questionList,
      '_id',
      id
      ).objectPosition;
    if(index !== -1) {
      questionFactory.questions.questionList.splice(index, 1);
    }
  };


    //     // just testing making filters :)
    // $scope.searchtest = "";
    // $scope.searchAuthor = function (question){
    //   if (question.author.indexOf($scope.searchtest)!=-1) {
    //     return true;
    //   }
    //   return false;
    // };

  $scope.upVote = function (questionId) {
    questionFactory.upVoteQuestion(questionId);
    var searchResults = toolboxFactory.findObjectInArray(
      questionFactory.questions.questionList,
      '_id',
      questionId
    );
    searchResults.referenceToObject.score += 1;
  };

  $scope.dnVote = function (questionId) {
    questionFactory.dnVoteQuestion(questionId);
    var searchResults = toolboxFactory.findObjectInArray(
      questionFactory.questions.questionList,
      '_id',
      questionId
    );
    searchResults.referenceToObject.score -= 1;
  };

}
]);