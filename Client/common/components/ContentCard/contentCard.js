'use strict';

var contentCardDirective = function() {
		return {
			bindToController: {
				'content': '=',
				'mode': '@'
			},
			scope: {},
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
		this._content = null;
		this.writingComment = false;
		this.submittingComment = false;
		this.newComment = ""
		this.subscription = null;
		this.mode = this.modes.VIEW;
		$scope.$on('$destroy', this.destroy.bind(this));

		return this;
	}
	contentCardController.prototype = Object.create(Object.prototype, {
		'content': {
			get: function() {return this._content},
			set: function(newContent) {
				if (! (newContent instanceof kusema.models.BaseContent)) {
					console.log('not proper content');
					return;
				}
				var oldContent = this._content;
				this._content = newContent;
				if (this.subscription) this.subscription.cancel();
				if (this.commentFactory) {
					this.subscription = this.commentFactory.subscribeTo(this.content, this.commentsChanged.bind(this));
				}
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
	contentCardController.prototype.destroy = function() {
		this.socketService.unwatchContent(this.content);
	}
	contentCardController.prototype.writeComment = function() {
		this.writingComment = true;
	}
	contentCardController.prototype.postComment = function() {
		this.submittingComment = true;
		this.commentFactory.add({parent: this.content._id, message: this.newComment}).then(
			function(response) {
				this.submittingComment = false;
				this.closeComment();
			}.bind(this)
		);
	}
	contentCardController.prototype.closeComment = function() {
		this.writingComment = false;
		this.newCommment = "";
	}
	contentCardController.prototype.editContent = function() {
		this.mode = this.modes.EDIT;
	}
	contentCardController.prototype.finishEditingContent = function() {
		this.mode = this.modes.VIEW;
	}
	contentCardController.prototype.editingSubmitted = function(newContent) {
		this.finishEditingContent();
		//this.content = newContent;
	}
	contentCardController.prototype.finishCreatingContent = function() {
		this.mode = this.modes.VIEW;
	}
	contentCardController.prototype.creatingSubmitted = function(newContent) {
		this.finishEditingContent();
		//this.content = newContent;
	}

	
kusema.addModule('kusema.components.contentCard')
		.directive('kusemaContentCard', contentCardDirective)
		.controller('kusemaContentCardController', ['$scope', '$timeout', 'commentService', 'loginService', 'socketFactory', contentCardController]);