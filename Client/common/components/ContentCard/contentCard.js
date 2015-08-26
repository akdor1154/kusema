'use strict';

var contentCardDirective = function() {
		return {
			bindToController: {
				'content': '='
			},
			scope: {},
			templateUrl: 'common/components/ContentCard/contentCardTemplate.html',
			css: 'common/components/ContentCard/contentCard.css',
			controller: 'kusemaContentCardController',
			controllerAs: 'c',
		};
	};
//}
var contentCardController = function($scope, commentFactory, loginService, socketService) {
		this.loginData = loginService.bindables;
		this.commentFactory = commentFactory;
		this.socketService = socketService;
		this.$scope = $scope;
		this._content = null;
		this.writingComment = false;
		this.submittingComment = false;
		this.newComment = ""
		this.subscription = null;
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
		}
	});
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
		this.commentFactory.addComment(this.content._id, {message: this.newComment}).then(
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
	contentCardController.prototype.onContentChanged = function(newContent, oldContent) {
	}
	
kusema.addModule('kusema.components.contentCard')
		.directive('kusemaContentCard', contentCardDirective)
		.controller('kusemaContentCardController', ['$scope', 'commentFactory', 'loginService', 'socketFactory', contentCardController]);