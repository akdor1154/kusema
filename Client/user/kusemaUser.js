var KusemaUserConfig = function($stateProvider) {
	$stateProvider
		.state('user.home', {
		    url: '',
		    template: '<kusema-question-list></kusema-question-list>'
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
		templateUrl: 'user/kusemaUserTemplate.html',
		replace: true,
		controller: 'kusemaUserController',
		controllerAs: 'c'
	};
};

var KusemaUserController = function($scope, $mdSidenav, groupService) {
	console.log('yo')
	this.$mdSidenav = $mdSidenav;
	$scope.toggle = this.toggle.bind(this);
	$scope.groupServiceData = groupService.bindables;
	$scope.searchGroups = function() {
		return $scope.groupServiceData.groupsArray;
	}
}
KusemaUserController.prototype = Object.create(Object.prototype);

KusemaUserController.prototype.toggle = function(id) {
	console.log('sup');
	this.$mdSidenav(id).toggle();
}


kusema.addModule('kusema.user', ['ngMaterial'])
	   .config(KusemaUserConfig)
	   .directive('kusemaUser', KusemaUserDirective)
	   .controller('kusemaUserController', ['$scope', '$mdSidenav', 'groupService', KusemaUserController]);