'use strict';

import BaseContentService from './BaseContentService'
import {Answer} from 'common/models';

var AnswerService = function($http, kusemaConfig, socketFactory) {
		this.initCommonDeps($http, kusemaConfig, socketFactory);
		this.urlBase = 'api/answers';
	}

	AnswerService.prototype = Object.create(BaseContentService.prototype ,{
		model: {writable: false, enumerable: false, value: Answer}
	});

	AnswerService.prototype.add = function(newAnswer) {
		return BaseContentService.prototype.add.call(this, newAnswer, newAnswer.question._id);
	}

import kusema from 'kusema';
kusema.service('answerService', ['$http', 'kusemaConfig', 'socketFactory', AnswerService]);

export default AnswerService;