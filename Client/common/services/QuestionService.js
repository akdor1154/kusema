'use strict';

var QuestionService = function($http, kusemaConfig, socketFactory, answerService, groupService) {
		this.initCommonDeps($http, kusemaConfig, socketFactory);
		this.urlBase = 'api/questions';
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
	    


kusema.service('questionService', ['$http', 'kusemaConfig', 'socketFactory', 'answerService', 'groupService', QuestionService]);