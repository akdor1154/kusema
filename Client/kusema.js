'use strict';

import angular from 'angular';
import 'angular-material';
import 'angular-ui-router';
import 'angular-css';

var kusema = angular.module('kusema', [
'ngMaterial',
'ui.router',
'door3.css',
'kusema.config',
'kusema.user'
]);

kusema.models = {};

kusema.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$mdThemingProvider', '$locationProvider', function (
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

  
}]);

kusema.run(['$rootScope', '$stateParams', function($rootScope, $stateParams) {
  $rootScope.$stateParams = $stateParams;
  console.log('hellooooo! :)');
}]);

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
var addModule = function (moduleName, dependencies, autoRequire) {
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
  var parent = kusema;
  if (parentChain.length > 0 && parentChain[0] == "kusema") {
    parentChain = parentChain.slice(1);
  } else {
    moduleName = "kusema."+moduleName;
  }


  var module = angular.module(moduleName, dependencies);
  if (autoRequire) {
    parent.requires.push(moduleName);
  }

  return parent;
}

kusema.addModule = addModule;
export {addModule};


export default kusema;