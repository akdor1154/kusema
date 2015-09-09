'use strict';

var inlineGroupDirective = function() {
		return {
			bindToController: {
				'group': '='
			},
			scope: {},
			templateUrl: 'common/components/InlineGroup/inlineGroup.html',
			controller: 'kusemaInlineGroupController',
			controllerAs: 'c',
		};
	};
//}
var inlineGroupController = function() {
		return this;
	}

	
kusema.addModule('kusema.components.inlineGroup')
		.directive('kusemaInlineGroup', inlineGroupDirective)
		.controller('kusemaInlineGroupController', inlineGroupController);