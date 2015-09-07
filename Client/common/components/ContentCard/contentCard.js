'use strict';

var contentCardDirective = function() {
		return {
			bindToController: {
				'content': '=',
				'mode': '@'
			},
			scope: {
				'contentType': '@'
			},
			templateUrl: 'common/components/ContentCard/contentCardTemplate.html',
			css: 'common/components/ContentCard/contentCard.css',
			controller: 'kusemaContentCardController',
			controllerAs: 'c',
		};
	};
//}
var contentCardController = function($scope, $timeout, commentFactory, loginService, socketService) {
		this.loginData = loginService.bindables;
		this.commentFactory = commentFactory;
		this.socketService = socketService;
		this.$timeout = $timeout;
		this.$scope = $scope;
		this.subscription = null;
		this.updateSubscription();
		this.mode = this.modes.VIEW;
		$scope.$on('$destroy', this.destroy.bind(this));

		return this;
	}
	contentCardController.prototype = Object.create(Object.prototype, {
		'content': {
			get: function() {return this._content},
			set: function(newContent) {
				this._content = newContent;
				this.updateSubscription();
			}
		},
		'mode': {
			get: function() {return this._mode},
			set: function(newMode) {
				this._mode = (newMode) ? newMode : this.modes.VIEW;
			}
		}
	});
	contentCardController.prototype.modes = {VIEW: "view", CREATE: "create", EDIT: "edit"};
	contentCardController.prototype.commentsChanged = function(newComments) {
		console.log(newComments);
		console.log('got new comments');
		this.$scope.$apply(function() {
			this.content.comments = newComments;
		}.bind(this));
	}
	contentCardController.prototype.updateSubscription = function() {
		if (this.content instanceof BaseContent) {
			if (this.subscription) this.subscription.cancel();
			if (this.commentFactory) {
				this.subscription = this.commentFactory.subscribeTo(this.content, this.commentsChanged.bind(this));
			}
		}
	}
	contentCardController.prototype.destroy = function() {
		this.socketService.unwatchContent(this.content);
	}
	contentCardController.prototype.editContent = function() {
		this.mode = this.modes.EDIT;
	}
	contentCardController.prototype.finishEditingContent = function() {
		this.mode = this.modes.VIEW;
	}
	contentCardController.prototype.editingSubmitted = function(newContent) {
		this.finishEditingContent();
	}
	contentCardController.prototype.creatingSubmitted = function(newContent) {
		this.finishEditingContent();
		this.content = newContent;
	}

var contentCardCommentDirective = function() {
	return {
		bindToController: {
			'comment': '=',
			'parentId': '=',
			'mode': '@'
		},
		scope: {},
		templateUrl: 'common/components/ContentCard/contentCardCommentTemplate.html',
		controller: 'kusemaContentCardCommentController',
		controllerAs: 'c',
	}
}

var contentCardCommentController = function(commentService, loginService) {
		this.submittingComment = false;
		this.newComment = ""
		this.commentService = commentService;
		this.loginData = loginService.bindables;
	}
	contentCardCommentController.prototype = Object.create(Object.prototype, {
		mode: {writable: true, value: "view"},
		viewMode: {
			get: function() {
				switch (this.mode) {
					case "create":
					case "edit":
						return "edit";
						break;
					case "view":
					default:
						return "view";
						break;
				}
			}
		},
		submitComment: {
			get: function() {
				switch (this.mode) {
					case "create":
						return this.createComment;
					case "edit":
						return this.editComment;
					default:
						return function() {};
				}
			}
		}
	})
	contentCardCommentController.prototype.startCreating = function() {
		this.mode = "create";
	}
	contentCardCommentController.prototype.startEditing = function() {
		this.mode = "edit";
		this.newComment = this.comment.message;
	}
	contentCardCommentController.prototype.postComment = function() {
		this.submittingComment = true;
		this.commentService.add({parent: this.parentId, message: this.newComment}).then(
			function(response) {
				this.submittingComment = false;
				this.stopEditing();
			}.bind(this)
		);
	}
	contentCardCommentController.prototype.editComment = function() {
		this.submittingComment = true;
		this.commentService.update(this.comment._id, {parent: this.parentId, message: this.newComment}).then(
			function(response) {
				this.submittingComment = false;
				this.stopEditing();
			}.bind(this)
		);
	}
	contentCardCommentController.prototype.deleteComment = function() {
		this.submittingComment = true;
		this.commentService.delete(this.comment._id).then(
			function(response) {
				this.submittingComment = false;
				this.stopEditing();
			}.bind(this)
		);
	}
	contentCardCommentController.prototype.stopEditing = function() {
		this.newCommment = "";
		this.mode = "view";
	}

	
kusema.addModule('kusema.components.contentCard')
		.directive('kusemaContentCard', contentCardDirective)
		.controller('kusemaContentCardController', ['$scope', '$timeout', 'commentService', 'loginService', 'socketFactory', contentCardController]);

kusema.addModule('kusema.components.contentCard.comment')
      .directive('kusemaContentCardComment', contentCardCommentDirective)
      .controller('kusemaContentCardCommentController', ['commentService', 'loginService', contentCardCommentController]);