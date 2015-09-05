'use strict';

var MarkdownService = function() {
	console.log('markdown');
	return window.markdownit({
		'html': false,
		'linkify': true,
		'breaks': true,
		});
}

kusema.factory('markdownService', MarkdownService);
