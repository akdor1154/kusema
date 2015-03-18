'use strict';

kusema.factory('commentFactory', ['$http' , '$routeParams', function($http, $routeParams) {
    var commentFactory = {};
    var urlBase = 'http://localhost:3000/comments';

    commentFactory.getComments = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    commentFactory.addComment = function (id, comment) {
        return $http.post(urlBase + '/' + id, comment);
    };

    // TODO
    commentFactory.updateComment = function (editedQuestion) {
        return $http.put(urlBase + '/' + $routeParams.id, editedQuestion);
    };

    // TODO
    commentFactory.upVoteComment = function (id) {
      return $http.put(urlBase + '/upvote/' + id);
    };

    // TODO
    commentFactory.dnVoteComment = function (id) {
      return $http.put(urlBase + '/dnvote/' + id);
    };

    commentFactory.deleteComment = function (commentId) {
        return $http.delete(urlBase + '/' + commentId);
    };

    // commentFactory.questions = {
    //   numberOfRequestsForQuestions: 1,
    //   questionsList: []
    // };

    // // Populate the questionList
    // commentFactory.getNextTenQuestions(0)
    // .success(function (quest) {
    //   commentFactory.questions.questionList = quest;
    // })
    // .error(function (error) {
    //   console.log('Unable to load questions: ' + error.message);
    // });


    return commentFactory;
}])
