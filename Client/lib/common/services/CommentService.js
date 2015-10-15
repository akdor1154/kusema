'use strict';

import BaseContentService from './BaseContentService.js';
import {Comment} from 'common/models.js';
import {Injector} from 'kusema.js';

var I = new Injector('$http', 'socketFactory');

var CommentSubscription = function(commentFactory, baseContent, callback) {
	    this.callback = callback;
	    this.commentFactory = commentFactory;
	    this.baseContent = baseContent;
	    I.socketFactory.watchContent(this.baseContent);
	    I.socketFactory.on('contentChanged', this.contentChanged.bind(this));
	    return this;
	}
	CommentSubscription.prototype.contentChanged = function(newContent) {
	    console.log('got message');
	    if (newContent.comments && newContent._id == this.baseContent._id) {
	        console.log('calling back');
	        this.callback(this.commentFactory.createClientModels(newContent.comments));
	    }
	}
	CommentSubscription.prototype.cancel = function() {
	    I.socketFactory.unwatchContent(this.baseContent);
	}
//} CommentSubScription


var CommentService = function() {
		BaseContentService.call(this, true);
		I.init();
        this.urlStem = 'api/comments';
    }

	CommentService.prototype = Object.create(BaseContentService.prototype, {
		model: {writable: false, enumerable: false, value: Comment}
	});

    CommentService.prototype.getComments = function (id) {
        return I.$http.get(this.urlBase + '/' + id)
                   .then(this.modelFromResponse.bind(this));
    };

    CommentService.prototype.add = function (comment) {
		return BaseContentService.prototype.add.call(this, comment, comment.parent);
    };
    CommentService.prototype.subscribeTo = function(baseContent, callback) {
        return new CommentSubscription(this, baseContent, callback);
    }
//} CommentService 

import kusema from 'kusema.js';
kusema.service('commentService', CommentService);

export default CommentService;