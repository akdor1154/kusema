'use strict';

var kusema = angular.module('kusema', [
'ngAnimate',
'ngMaterial',
'ui.router',
'kusema.config',
'kusema.user',
'kusema.userMenu',
'kusema.questionPreview',
]);

kusema.config(function($stateProvider, $urlRouterProvider, $httpProvider, $mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-purple')
    .accentPalette('pink')

  $httpProvider.defaults.withCredentials = true;

  /* Direct unmatched urls */
  /*$stateProvider.otherwise({
    templateUrl: '404.html',
  });*/

  /* Direct urls */
  $stateProvider
    .state('user', {
      template: '<kusema-user></kusema-user>',
      abstract: true,
      url: '/kusema'
    });

  $urlRouterProvider
    .when('','/kusema')
    .when('/','/kusema');

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

