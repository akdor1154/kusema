'use strict';

/*global io */

/**
 * @ngdoc overview
 * @name forumApp
 * @description
 * # forumApp
 *
 * Main module of the application.
 */

 var kusema = angular.module('kusema', [
  'ngRoute', //add animate back later
  ]);

 kusema.config(function($routeProvider) {
    
    /* Where to direct unmatched urls */
    $routeProvider.otherwise({
      redirectTo: '/'
    });

    /* Where to direct urls */
    $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/question/:id', {
      templateUrl: 'views/question.html',
      controller: 'QuestionCtrl'
    });    
  })

 kusema.factory('questionFactory', ['$http' , '$routeParams', function($http, $routeParams) {

    var questionFactory = {};
    var urlBase = 'http://0.0.0.0:3000/questions';

    questionFactory.getQuestions = function () {
        return $http.get(urlBase);
        console.log("workind")

    };

    questionFactory.getNextTenQuestions = function (requestNumber) {
        return $http.get(urlBase + '/tenMore/' + requestNumber);
    };

    questionFactory.getQuestionById = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    questionFactory.addQuestion = function (post) {
        return $http.post(urlBase, post);
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
      console.log('Unable to load questions: ' + error.message);
    });


    return questionFactory;
}])

 kusema.factory('commentFactory', ['$http' , '$routeParams', function($http, $routeParams) {
    var commentFactory = {};
    var urlBase = 'http://0.0.0.0:3000/comments';

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

  kusema.factory('socketFactory', ['$rootScope', function ($rootScope) {
    var socket = io.connect('http://0.0.0.0:3000/');
      return {
      
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          console.log('args -' + arguments);
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  }])


kusema.factory('toolboxFactory', [function() {

  /* Provides useful browser events, properties and functions to controllers */
  var toolboxFactory = {};

  toolboxFactory.findObjectInArray = function(array, property, value){
    for (var i = 0, len = array.length; i < len; i++) {
      if (array[i][property] === value) {
        return {
          referenceToObject: array[i],
          objectPosition: i
        };
      }
    }
    return {
      referenceToObject: -1,
      objectPosition: -1
    };
  };

  toolboxFactory.documentHeight = function() {
    var D = document;
    return Math.max(
      Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
      Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
      Math.max(D.body.clientHeight, D.documentElement.clientHeight)
      );
  };

  toolboxFactory.scrollMax = function(callback) {
    window.onscroll = function() {
      if ((window.innerHeight + window.scrollY + 20) >= toolboxFactory.documentHeight()) {
        callback();
      }
    };
  };

  return toolboxFactory;
}]);