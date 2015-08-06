'use strict';

var kusema = angular.module('kusema', [
'ngAnimate',
'ngMaterial',
'ngRoute',
'kusema.config'
]);

kusema.config(function($routeProvider, $httpProvider) {
  
  $httpProvider.defaults.withCredentials = true;

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
  })
  .when('/newcomment/:id', {
	  templateUrl: 'views/newComment.html',
  })
  .when('/newquestion/', {
	  templateUrl: 'views/newQuestion.html',
  })
  .when('/newunit/', {
	  templateUrl: 'views/newUnit.html',
  })
  .when('/newarea/', {
	  templateUrl: 'views/newArea.html',
  });
  
});

