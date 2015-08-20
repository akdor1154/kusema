var KusemaUserConfig = function($stateProvider) {
	$stateProvider
		.state('user.home', {
		    url: '^',
		    templateUrl: 'user/home/home.html',
		    controller: 'QuestionListController',
		    controllerAs: 'c'
		})
		.state('user.question', {
			url: '^/question/:id',
			templateUrl: 'user/question/question.html',
			controller: 'QuestionController',
			controllerAs: 'c'
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

var KusemaUserController = function($scope) {
	return this;
}

angular.module('kusema.user', [])
	   .config(KusemaUserConfig)
	   .directive('kusemaUser', KusemaUserDirective)
	   .controller('kusemaUserController', KusemaUserController);