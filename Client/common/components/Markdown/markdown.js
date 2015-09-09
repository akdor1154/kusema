var markdownDirective = function() {
	return {
		bindToController: {
			'input': '=',
			'inline': '='
		},
		scope: {},
		controller: 'markdownController',
		controllerAs: 'c',
		template: '<span ng-bind-html="c.output"></span>'
	}
}

var markdownController = function(markdownService, $sce) {
	this.$sce = $sce;
	this.md = markdownService;
	this.updateOutput();
}
markdownController.prototype = Object.create(Object.prototype, {
	'output': {writable: true, enumerable: false, value: ''},
	'_input': {writable: true, enumerable: false, value:''},
	'inline': {writable: true, enumerable: false, value: true},
	'input': {
		get: function() {
			return this._input;
		},
		set: function(newInput) {
			this._input = newInput;
			this.updateOutput();
		}
	}
});

markdownController.prototype.updateOutput = function() {
	if (this.md && this._input) {
		var renderer = (this.inline) ? this.md.renderInline.bind(this.md) : this.md.render.bind(this.md);
		if (this.inline) {
			console.log('rendering inline: '+this.input);
		} else {
			console.log('rendering full: '+this.input);

		}
		this.output = this.$sce.trustAsHtml(renderer(this.input));
	}
} 

kusema.addModule('kusema.components.markdown')
      .directive('kusemaMarkdown', markdownDirective)
      .controller('markdownController', ['markdownService', '$sce', markdownController])