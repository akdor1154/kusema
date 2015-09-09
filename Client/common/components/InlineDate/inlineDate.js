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
		return this;
	}
	inlineDateController.prototype.format = function($scope) {
		if (this.date instanceof Date) {
			return this.date.toLocaleString();
		} else {
			return '';
		}
	}

	
kusema.addModule('kusema.components.inlineDate')
		.directive('kusemaInlineDate', inlineDateDirective)
		.controller('kusemaInlineDateController', inlineDateController);