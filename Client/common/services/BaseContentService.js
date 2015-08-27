'use strict';

var BaseContentService = function($http, kusemaConfig, socketFactory, questionService, answerService, commentService) {
		this.initCommonDeps($http, kusemaConfig, socketFactory);
		this.questionService = questionService;
		this.answerService = answerService;
		this.commentService = commentService;
	}

	BaseContentService.prototype = Object.create(Object.prototype, {
		model: {writable: false, enumerable: false, value: BaseContent}
	});

	BaseContentService.prototype.initCommonDeps = function($http, kusemaConfig, socketFactory) {
		this.$http = $http;
		this.kusemaConfig = kusemaConfig
		this.socketFactory = socketFactory;
	}

	BaseContentService.prototype.getService = function(serviceNameOrObject) {
		var serviceName;
		if (!serviceNameOrObject) {
			serviceName = null;
		} else {
			if (serviceNameOrObject.__t) {
				serviceName = serviceNameOrObject.__t;
			} else if (serviceNameOrObject.factory) {
				return serviceNameOrObject.factory;
			} else if (typeof serviceNameOrObject == "string") {
				serviceName = serviceNameOrObject;
			}
		}
		
		switch (serviceName.toLowerCase()) {
			case 'question':
				return this.questionService;
				break;
			case 'answer':
				return this.answerService;
				break;
			case 'comment':
				return this.commentService;
				break;
			case 'basecontent':
				console.error('a raw basecontent object is being passed around...');
				return this;
				break;
		}
	}
    BaseContentService.prototype.createClientModel = function(responseJSON) {
        return new this.model(responseJSON, this);
    }
	BaseContentService.prototype.modelFromResponse = function(response) {
		return this.createClientModel(response.data);
	}
    BaseContentService.prototype.getAll = function () {
        return this.$http.get(this.urlBase)
        		   .then(function(response) {
        		   		return response.data.map(this.createClientModel.bind(this));
        		   }.bind(this));
    };
    BaseContentService.prototype.get = function (id) {
        return this.$http.get(this.urlBase + '/' + id)
        		   .then(this.modelFromResponse.bind(this));
    };
    BaseContentService.prototype.add = function (content, extraURL) {
    	var content;
    	if (!extraURL) {
    		extraURL = '';
    	}
    	if (extraURL) {
    		extraURL = '/'+extraURL;
    	}
        return this.$http.post(this.urlBase+extraURL, JSON.stringify(content, this.sanitizeJson))
        		   .then(this.modelFromResponse.bind(this));
    };
    BaseContentService.prototype.update = function (id, editedContent) {
        return this.$http.put(this.urlBase + '/' + id, editedContent);
    };
    BaseContentService.prototype.upVote = function (id) {
    	return this.$http.put(this.urlBase + '/upvote/' + id);
    };
    BaseContentService.prototype.downVote = function (id) {
    	return this.$http.put(this.urlBase + '/dnvote/' + id);
    };
    BaseContentService.prototype.delete = function (id) {
        return this.$http.delete(this.urlBase + '/' + id);
    };
    BaseContentService.prototype.createClientModels = function(responseJSON) {
        return responseJSON.map(this.createClientModel.bind(this));
    }
    // this gets passed as a parameter to JSON.stringify; its function is to replace
    // any submodels in our main model with just their _ids.
    BaseContentService.prototype.sanitizeJson = function(key, value) {
    	if (value === this) {
    		// we always want to continue to recurse into our main object, else
    		// it'll get caught in the next bit and truncated to just its ID!
    		return value;
    	} else if (value && value._id) {
    		return value._id;
    	} else {
    		return value;
    	}
    }
//} BaseContentService

kusema.service('baseContentService', ['$http', 'kusemaConfig', 'socketFactory', 'questionService', 'answerService', 'commentService', BaseContentService]);
