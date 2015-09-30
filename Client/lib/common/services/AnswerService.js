'use strict';

import BaseContentService from './BaseContentService.js'
import {Answer} from 'common/models.js';

var AnswerService = function($http, socketFactory) {
		this.initCommonDeps($http, socketFactory);
		this.urlStem = 'api/answers';
	}

	AnswerService.prototype = Object.create(BaseContentService.prototype ,{
		model: {writable: false, enumerable: false, value: Answer}
	});

	AnswerService.prototype.add = function(newAnswer) {
		return BaseContentService.prototype.add.call(this, newAnswer, newAnswer.question._id);
	}

import kusema from 'kusema.js';
kusema.service('answerService', ['$http', 'socketFactory', AnswerService]);

export default AnswerService;