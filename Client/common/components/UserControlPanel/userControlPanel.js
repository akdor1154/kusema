var UserControlPanelDirective = function() {
	return {
		scope: {},
		templateUrl: 'common/components/UserControlPanel/userControlPanelTemplate.html',
		controller: 'userControlPanelController',
		controllerAs: 'c'
	}
};

var UserControlPanelController = function() {
	return this;
}
UserControlPanelController.prototype = Object.create(Object.prototype);

UserControlPanelController.prototype.showUserControlPanel = function() {
	console.log('showing user cp');
}

var UserControlPanelConfig = function($rootScope) {
	console.log('configuring usercp')
	$rootScope.showUserControlPanel = UserControlPanelController.prototype.showUserControlPanel;
}

kusema.addModule('components.userControlPanel')
      .directive('kusemaUserControlPanel', UserControlPanelDirective)
      .controller('userControlPanelController', UserControlPanelController)
      .run(['$rootScope', UserControlPanelConfig]);
