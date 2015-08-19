'use strict';

var kusema = angular.module('kusema', [
'ngAnimate',
'ngMaterial',
'ui.router',
'kusema.config'
]);

kusema.config(function($stateProvider, $httpProvider, $mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-purple')
    .accentPalette('pink')

  $httpProvider.defaults.withCredentials = true;

  /* Direct unmatched urls */
  $routeProvider.otherwise({
    templateUrl: '404.html',
  });

  /* Direct urls */
  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'user/home/home.html'
  })
  .state('question', {
    url: '/question/:id',
    templateUrl: 'user/question/question.html',
    controller: 'QuestionController'
  })


  /*
  .state('/question/:id', {
    templateUrl: 'user/question/question.html',
  })
  .when('/group/:id', {
    templateUrl: 'user/group/group.html',
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
  });*/
  
});

