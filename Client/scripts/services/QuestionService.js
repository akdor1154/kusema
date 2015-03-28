'use strict';

kusema.factory('questionFactory', ['$http' , '$routeParams', 'kusemaConfig', function($http, $routeParams, kusemaConfig) {

    var questionFactory = {};
    var urlBase = kusemaConfig.url()+'api/questions';

    questionFactory.getQuestions = function () {
        return $http.get(urlBase, {withCredentials: true});
    };

    questionFactory.getNextTenQuestions = function (requestNumber) {
        return $http.get(urlBase + '/tenMore/' + requestNumber, {withCredentials: true});
    };

    questionFactory.getQuestionById = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    questionFactory.addQuestion = function (question) {
        return $http.post(urlBase, question);
    };

    questionFactory.updateQuestion = function (editedQuestion) {
        return $http.put(urlBase + '/' + $routeParams.id, editedQuestion);
    };

    questionFactory.upVoteQuestion = function (id) {
      return $http.put(urlBase + '/upvote/' + id);
    };

    questionFactory.dnVoteQuestion = function (id) {
      return $http.put(urlBase + '/dnvote/' + id);
    };

    questionFactory.deleteQuestion = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    questionFactory.questions = {
      numberOfRequestsForQuestions: 1,
      questionsList: []
    };

    // Populate the questionList
    questionFactory.getNextTenQuestions(0)
    .success(function (quest) {
      questionFactory.questions.questionList = quest;
    })
    .error(function (error) {
      console.log('Unable to load questions: ' + error + error.message);
    });


    return questionFactory;
}])
