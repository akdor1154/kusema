'use strict';

import BaseContentService from './BaseContentService.js';
import {Question} from 'common/models.js';

var QuestionService = function($http, socketFactory, answerService, groupService) {
		this.initCommonDeps($http, socketFactory);
		this.urlStem = 'api/questions';
		this.answerService = answerService;
		this.groupService = groupService;
	}

	QuestionService.prototype = Object.create(BaseContentService.prototype, {
		model: {writable: false, enumerable: false, value: Question}
	});

	QuestionService.prototype.getNextTenQuestions = function (requestNumber, group) {
		var groupURL = (group) ? ('/'+group) : '';
        return this.$http.get(this.urlBase + '/tenMore' + groupURL + '/' + requestNumber)
                    .then(function(response) {
                        return this.createClientModels(response.data);
                    }.bind(this));
	    };
	   
	QuestionService.prototype.getFeed = function(requestNumber) {
		return this.$http.get(this.urlBase+'/feed/'+requestNumber)
				.then( (response) => this.createClientModels(response.data) );
	}

import kusema from 'kusema.js';
kusema.service('questionService', ['$http', 'socketFactory', 'answerService', 'groupService', QuestionService]);