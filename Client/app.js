'use strict';

var kusema = angular.module('kusema', [
'ngAnimate',
'ngMaterial',
'ui.router',
'door3.css',
'kusema.config',
'kusema.user',
'kusema.components'
]);

kusema.models = {};

kusema.config(function (
                $stateProvider,
                $urlRouterProvider,
                $httpProvider,
                $mdThemingProvider,
                $locationProvider
              ) {
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-purple')
    .accentPalette('pink')

  $httpProvider.defaults.withCredentials = true;

  $locationProvider.html5Mode(true);
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

/*
kusema.addModule(string moduleName, dependencies=[], autoRequire=true)

 adds a module by name and by property, and automatically makes
 its parent require it.
 kusema.addModule('components');
 => kusema.components = angular.module('kusema.components', []);
    kusema.requires.push('kusema.components');

  if you don't want to automatically have this module's parents require it,
  call with autoRequire set to false.

  module is always assumed to be a child of kusema, so
  addModule('kusema.components') has exactly the same effect as
  addModule('components') .
*/
kusema.addModule = function (moduleName, dependencies, autoRequire) {
  if (dependencies === undefined) {
    dependencies = [];
  }
  if (autoRequire === undefined) {
    autoRequire = true;
  }
  if (typeof(moduleName) != "string") {
    throw new TypeError("moduleName must be a string, e.g. \"components.magic\"");
  }
  var splitName = moduleName.split(".");
  var parentChain = splitName.slice(0,-1);
  var module = splitName[splitName.length-1];
  var parent = this;
  if (parentChain.length > 0 && parentChain[0] == "kusema") {
    parentChain = parentChain.slice(1);
  } else {
    moduleName = "kusema."+moduleName;
  }
  for (var property of parentChain) {
    parent = parent[property];
  }
  parent[module] = angular.module(moduleName, dependencies);
  if (autoRequire) {
    parent.requires.push(moduleName);
  }

  return parent[module];
}