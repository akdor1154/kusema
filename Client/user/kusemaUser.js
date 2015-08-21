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

var KusemaUserController = function($scope) {
	return this;
}

angular.module('kusema.user', [
			'kusema.user.questionList',
			'kusema.user.questionFull'
		])
	   .config(KusemaUserConfig)
	   .directive('kusemaUser', KusemaUserDirective)
	   .controller('kusemaUserController', KusemaUserController);