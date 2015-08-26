'use strict';

var inlineDateDirective = function() {
		return {
			bindToController: {
				'date': '='
			},
			scope: {},
			templateUrl: 'common/components/InlineDate/inlineDate.html',
			controller: 'kusemaInlineDateController',
			controllerAs: 'c',
		};
	};
//}
var inlineDateController = function($scope) {
		this.date = new Date();
		return this;
	}
	inlineDateController.prototype.format = function($scope) {
		return this.date.toLocaleString();
	}

	
kusema.addModule('kusema.components.inlineDate')
		.directive('kusemaInlineDate', inlineDateDirective)
		.controller('kusemaInlineDateController', inlineDateController);