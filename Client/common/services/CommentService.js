'use strict';

var Comment = kusema.models.Comment;
    }
//} Question

kusema.factory('commentFactory', ['$http' , 'socketFactory', 'kusemaConfig', function($http, socketFactory, kusemaConfig) {
    var commentFactory = {};
    var urlBase = kusemaConfig.url()+'api/comments';

    commentFactory.getComments = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    commentFactory.addComment = function (id, comment) {
        socketFactory.emit('message sent', comment.message);
        return $http.post(urlBase + '/' + id, comment);
    };

    // TODO
    commentFactory.updateComment = function (id, editedComment) {
        return $http.put(urlBase + '/' + id, editedComment);
    };

    // TODO
    commentFactory.upVoteComment = function (id) {
      return $http.put(urlBase + '/upvote/' + id);
    };

    // TODO
    commentFactory.downVoteComment = function (id) {
      return $http.put(urlBase + '/dnvote/' + id);
    };

    commentFactory.deleteComment = function (commentId) {
        return $http.delete(urlBase + '/' + commentId);
    };

    commentFactory.createComment = function(responseJSON) {
        return new Comment(responseJSON, this);
    }

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
