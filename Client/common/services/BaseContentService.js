var BaseContentService = function(questionService, commentService) {
	this.questionService = questionService;
	this.commentService = commentService;
}

BaseContentService.prototype = Object.create(Object.prototype);

BaseContentService.prototype.getService = function(serviceNameOrObject) {
	var serviceName;
	if (serviceNameOrObject.__t) {
		serviceName = serviceNameOrObject.__t;
	} else if (typeof serviceNameOrObject == "string") {
		serviceName = serviceNameOrObject;
	} else if (serviceNameOrObject.factory) {
		return serviceNameOrObject.factory;
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

kusema.service('baseContentService', ['questionFactory', 'commentFactory', BaseContentService]);