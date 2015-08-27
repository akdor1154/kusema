'use strict';

var Question = kusema.models.Question;
var Answer = kusema.models.Answer;
var Comment = kusema.models.Comment;

var BaseContentService = function($http, kusemaConfig, socketFactory, questionService, answerService, commentService) {
	this.initCommonDeps($http, kusemaConfig, socketFactory);
	this.questionService = questionService;
	this.answerService = answerService;
	this.commentService = commentService;
}

BaseContentService.prototype = Object.create(Object.prototype);

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
		
		switch (serviceName) {
			case 'Question':
				return this.questionService;
				break;
			case 'Answer':
				return this.answerService;
				break;
			case 'Comment':
				return this.commentService;
				break;
			case 'BaseContent':
				console.error('a raw basecontent object is being passed around...');
				return this;
				break;
		}
	}
    BaseContentService.prototype.getAll = function () {
        return this.$http.get(this.urlBase);
    };
    BaseContentService.prototype.get = function (id) {
        return this.$http.get(this.urlBase + '/' + id)
                    .then(function(response) {
                        return this.createClientModel(response.data);
                    }.bind(this));
    };
    BaseContentService.prototype.add = function (content) {
        return this.$http.post(this.urlBase, JSON.stringify(content));
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


var QuestionService = function($http, kusemaConfig, socketFactory) {
		this.initCommonDeps($http, kusemaConfig, socketFactory);

		this.urlBase = this.kusemaConfig.url()+'api/questions';
		var questionFactory = this;
		//TODO: delete this.
		this.questions = {
	      numberOfRequestsForQuestions: 1,
	      questionsList: [],
	      add: function(responseJSON) {
	        this.questionsList.push(questionFactory.createClientModel(responseJSON));
	      },
	      addQuestions: function(questions) {
	        this.questionsList = questions;
	      },
	      delete: function(id) {
	        var questionIndex = this.getIndexOf(id);
	        if (questionIndex) {
	            this.questionsList.splice(questionIndex, 1);
	        }
	      },
	      getIndexOf: function(id) {
	        var possibleQuestions = this.questionsList.filter(function(question) {return question._id == id;});
	        if (possibleQuestions.length > 0) {
	            return possibleQuestions[0]
	        } else {
	            return null;
	        }
	      }
	    };

	    this.getNextTenQuestions(0)
	    .then(
	        function (quest) {
	            this.questions.addQuestions(quest);
	        }.bind(this),
	        function (error) {
	            console.error('Unable to load questions: ' + error + error.message);
	        }
	    );
	}

	QuestionService.prototype = Object.create(BaseContentService.prototype);

	QuestionService.prototype.getNextTenQuestions = function (requestNumber) {
	        return this.$http.get(this.urlBase + '/tenMore/' + requestNumber)
	                    .then(function(response) {
	                        return this.createClientModels(response.data);
	                    }.bind(this));
	    };

	QuestionService.prototype.createClientModel = function(responseJSON) {
        return new Question(responseJSON, this);
    }



var CommentSubscription = function(socketFactory, commentFactory, baseContent, callback) {
	    this.callback = callback;
	    this.socketFactory = socketFactory;
	    this.commentFactory = commentFactory;
	    this.baseContent = baseContent;
	    this.socketFactory.watchContent(this.baseContent);
	    this.socketFactory.on('contentChanged', this.contentChanged.bind(this));
	    return this;
	}
	CommentSubscription.prototype.contentChanged = function(newContent) {
	    console.log('got message');
	    if (newContent.comments) {
	        console.log('calling back');
	        this.callback(this.commentFactory.createClientModels(newContent.comments));
	    }
	}
	CommentSubscription.prototype.cancel = function() {
	    this.socketFactory.unwatchContent(this.baseContent);
	}

var CommentService = function($http, kusemaConfig, socketFactory) {
		this.initCommonDeps($http, kusemaConfig, socketFactory);

        this.urlBase = kusemaConfig.url()+'api/comments';

    }

	CommentService.prototype = Object.create(BaseContentService.prototype);

    CommentService.prototype.getComments = function (id) {
        return this.$http.get(this.urlBase + '/' + id);
    };

    CommentService.prototype.add = function (comment) {
        return this.$http.post(this.urlBase + '/' + comment.parent, comment);
    };
    CommentService.prototype.createClientModel = function(responseJSON) {
        return new Comment(responseJSON, this);
    }
    CommentService.prototype.subscribeTo = function(baseContent, callback) {
        return new CommentSubscription(this.socketFactory, this, baseContent, callback);
    }
//} CommentFactory 


var AnswerService = function($http, kusemaConfig, socketFactory) {
		this.initCommonDeps($http, kusemaConfig, socketFactory);
	}

	AnswerService.prototype = Object.create(BaseContentService.prototype);




kusema.service('baseContentService', ['$http', 'kusemaConfig', 'socketFactory', 'questionService', 'answerService', 'commentService', BaseContentService]);
kusema.service('questionService', ['$http', 'kusemaConfig', 'socketFactory', QuestionService]);
kusema.service('commentService', ['$http', 'kusemaConfig', 'socketFactory', CommentService]);
kusema.service('answerService', ['$http', 'kusemaConfig', 'socketFactory', CommentService]);
