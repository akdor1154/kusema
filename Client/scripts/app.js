'use strict';

var kusema = angular.module('kusema', [
'ngRoute', //add animate back later
'kusema.config'
]);

kusema.config(function($routeProvider) {
  
  /* Where to direct unmatched urls */
  $routeProvider.otherwise({
    templateUrl: '404.html',
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
});

var kusemaConfigModule = angular.module('kusema.config', [])
  .constant('kusemaConfig', {
    'host': 'localhost',
    'port': '3000',
    'url': function() { return 'http://'+this.host+':'+this.port+'/'; }
  });
