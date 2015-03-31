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
    templateUrl: 'views/main.html'
  })
  .when('/question/:id', {
    templateUrl: 'views/question.html',
  });    
});

