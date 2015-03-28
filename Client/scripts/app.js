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

var kusemaConfigModule = angular.module('kusema.config', [])
  .constant('kusemaConfig', {
    'host': 'localhost',
    'port': '3000',
    'url': function() { return 'http://'+this.host+':'+this.port+'/'; }
  });
