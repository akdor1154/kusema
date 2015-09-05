var questionPreviewDirective = function() {
		return {
			scope: {
				'question': '='
			},
			templateUrl: 'common/components/QuestionPreview/questionPreviewTemplate.html',
			controller: 'kusemaQuestionPreviewController',
			controllerAs: 'c',
			css: 'common/components/QuestionPreview/questionPreview.css'
		};
	};
//}
var questionPreviewController = function($scope) {
		this.$scope = $scope;
		this.question = $scope.question;
		return this;
	}
	
kusema.addModule('kusema.components.questionPreview')
		.directive('kusemaQuestionPreview', questionPreviewDirective)
		.controller('kusemaQuestionPreviewController', questionPreviewController);