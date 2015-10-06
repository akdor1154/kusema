'use strict';

import BaseContentService from './BaseContentService.js';
import {Question} from 'common/models.js';
import {Injector} from 'kusema.js';

var I = new Injector('$http');

var QuestionService = function() {
		BaseContentService.call(this, true);
		I.init();
		this.urlStem = 'api/questions';
	}

	QuestionService.prototype = Object.create(BaseContentService.prototype, {
		model: {writable: false, enumerable: false, value: Question}
	});

	QuestionService.prototype.getNextTenQuestions = function (requestNumber, group) {
		var groupURL = (group) ? ('/'+group) : '';
        return I.$http.get(this.urlBase + '/tenMore' + groupURL + '/' + requestNumber)
                    .then(function(response) {
                        return this.createClientModels(response.data);
                    }.bind(this));
	    };
	   
	QuestionService.prototype.getFeed = function(requestNumber) {
		return I.$http.get(this.urlBase+'/feed/'+requestNumber)
				.then( (response) => this.createClientModels(response.data) );
	}

import kusema from 'kusema.js';
kusema.service('questionService', QuestionService);