'use strict';

var MarkdownService = function(hljs) {
	console.log('markdown');
	return window.markdownit({
		'html': false,
		'linkify': true,
		'breaks': true,
		'highlight': function(code, language) {
			if (language && hljs.getLanguage(language)) {
				try {
					console.log('highlighting');
					return hljs.highlight(language, code).value;
				} catch (e) {}
			}
			return '';
		}
		});
}

kusema.factory('markdownService', ['highlightService', MarkdownService]);
