'use strict';

var kusema = angular.module('kusema', [
'ngRoute',
'kusema.config'
]);

kusema.config(function($routeProvider) {
  
  /* Direct unmatched urls */
  $routeProvider.otherwise({
    templateUrl: '404.html',
  });

  /* Direct urls */
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .when('/question/:id', {
    templateUrl: 'views/question.html',
    controller: 'QuestionCtrl'
  });    
});

