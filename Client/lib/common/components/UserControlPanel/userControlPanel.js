import template from './userControlPanelTemplate.html';

var UserControlPanelDirective = function() {
	return {
		template: template,
		controller: 'userControlPanelController',
		controllerAs: 'c'
	}
};

var UserControlPanelController = function($css, $scope, $mdBottomSheet, loginService, groupService) {
		//this thing doesn't actually use a real directive, so the css plugin doesn't work
		// automatically :(
		$css.bind({href: 'lib/common/components/UserControlPanel/userControlPanel.css'}, $scope);
		this.gs = groupService;
		this.ls = loginService;
		this.$scope = $scope;
		this.$mdBottomSheet = $mdBottomSheet;
		this.userGroups = loginService.bindables.user.subscriptions.groups.slice();
		this.authcateGroups = loginService.bindables.user.authcateSubscriptions.groups.slice();
		this.manualGroups = loginService.bindables.user.manualSubscriptions.groups.slice();
		this.manualTopics = loginService.bindables.user.manualSubscriptions.topics.slice();
		console.log('bottom sheet controller made');
		return this;
	}
	UserControlPanelController.prototype = Object.create(Object.prototype);

	UserControlPanelController.prototype.showUserControlPanel = function($mdBottomSheet) {
		$mdBottomSheet.show(UserControlPanelDirective());
	}

	UserControlPanelController.prototype._addThing = function(selectedThing, listOfThings, listToAddTo) {
		console.log('adding group');
		var thingToAdd = null;
		var currentFilter = [];

		if (selectedThing) {
			thingToAdd = selectedThing;
		} else if (listOfThings.length == 1) {
			thingToAdd = listOfThings[0];
		} else {
			return false;
		}

		if (listToAddTo.indexOf(thingToAdd) == -1) {
			listToAddTo.push(thingToAdd);
		} else {
			console.log('already in :(');
		}
	}

	UserControlPanelController.prototype.addGroup = function() {
		return this._addThing(
			this.selectedGroup, 
			this.gs.filterGroups(this.$scope.groupSearchText),
			this.manualGroups
		);
	}

	UserControlPanelController.prototype.addTopic = function() {
		return this._addThing(
			this.selectedTopic, 
			this.gs.filterTopics(this.$scope.topicSearchText),
			this.manualTopics
		);
	}


	import {removeFromArray} from 'common/util.js';
	UserControlPanelController.prototype.removeGroup = function(group) {
		removeFromArray(group, this.manualGroups);
	}
	UserControlPanelController.prototype.removeTopic = function(topic) {
		removeFromArray(topic, this.manualTopics);
	}

	UserControlPanelController.prototype.saveUser = function() {
		this.ls.updateManualSubscriptions({
			groups: this.manualGroups,
			topics: this.manualTopics
		})
		.then( () => this.$mdBottomSheet.hide() );
	}

//}

var UserControlPanelConfig = function($rootScope, $mdBottomSheet) {
	console.log('configuring usercp')
	$rootScope.showUserControlPanel = UserControlPanelController.prototype.showUserControlPanel.bind(window, $mdBottomSheet);
}


import listItem from './groupListItemTemplate.html';
var GroupListItemDirective = function() {
	return {
		template: listItem,
		scope: true,
		replace: true
	}
}

import {addModule} from 'kusema.js';

addModule('components.userControlPanel')
      .directive('kusemaUserControlPanel', UserControlPanelDirective)
      .controller('userControlPanelController', ['$css', '$scope', '$mdBottomSheet', 'loginService', 'groupService', UserControlPanelController])
      .directive('kusemaGroupListItem', GroupListItemDirective)
      .run(['$rootScope', '$mdBottomSheet', UserControlPanelConfig]);
