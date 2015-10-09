import 'kusema.js';

import './questionList/questionList.js';
import './questionFull/questionFull.js';
import template from './kusemaUserTemplate.html';

import {Injector} from 'kusema.js';

var KusemaUserConfig = function($stateProvider) {
	$stateProvider
		.state('user.home', {
		    url: '',
		    template: '<kusema-question-list></kusema-question-list>'
		})
		.state('user.group', {
		    url: '/group/:groupID',
		    template: '<kusema-question-list group="$root.$stateParams.groupID"></kusema-question-list>'
		})
		.state('user.question', {
			url: '/question/:id',
			template: '<kusema-question-full></kusema-question-full>'
		});
}

var KusemaUserDirective = function() {
	console.log('hello');
	return {
		scope: {
			action: '='
		},
		template: template,
		controller: 'kusemaUserController',
		controllerAs: 'c',
		css: 'lib/user/kusemaUser.css'
	};
};

var I = new Injector('loginService', 'groupService', '$state');

var KusemaUserController = function($scope, $mdSidenav) {
	I.init();
	this.$mdSidenav = $mdSidenav;
	$scope.toggle = this.toggle.bind(this);
	$scope.loginData = I.loginService.bindables;
	this.gs = I.groupService;
	console.log($scope);
	$scope.searchGroups = function() {
		return $scope.loginData.subscriptions.groups;
	}
}
KusemaUserController.prototype = Object.create(Object.prototype);

KusemaUserController.prototype.toggle = function(id) {
	console.log('sup');
	this.$mdSidenav(id).toggle();
}
KusemaUserController.prototype.goToGroup = function(newGroup) {
	if (!newGroup) return;
	I.$state.go('user.group', {groupID: newGroup});
}

import kusema from 'kusema.js';

export default kusema.addModule('kusema.user', ['ngMaterial'])
	   .config(['$stateProvider', KusemaUserConfig])
	   .directive('kusemaUser', KusemaUserDirective)
	   .controller('kusemaUserController', ['$scope', '$mdSidenav', KusemaUserController]);