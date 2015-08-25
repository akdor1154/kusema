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
var contentCardController = function($scope, commentFactory, loginService) {
		this.loginData = loginService.bindables;
		this.commentFactory = commentFactory;
		this.writingComment = false;
		this.submittingComment = false;
		this.newComment = ""
		return this;
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
	
kusema.addModule('kusema.components.contentCard')
		.directive('kusemaContentCard', contentCardDirective)
		.controller('kusemaContentCardController', ['$scope', 'commentFactory', 'loginService', contentCardController]);