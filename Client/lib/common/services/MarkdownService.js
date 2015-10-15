'use strict';

import hljs from 'highlightjs';
import markdownIt from 'markdown-it';

import 'highlightjs/styles/github.css!';

var MarkdownService = function() {
	console.log('markdown');
	return markdownIt({
		'html': false,
		'linkify': true,
		'breaks': true,
		'highlight': function(code, language) {
			if (language && hljs.getLanguage(language)) {
				try {
					console.log('highlighting');
					return hljs.highlight(language, code).value;
				} catch (e) {
					console.log('highlight error');
				}
			} else {
				console.error(language);
				console.error(hljs);
			}
			return '';
		}
		});
}

import kusema from 'kusema.js';
kusema.factory('markdownService', [MarkdownService]);
