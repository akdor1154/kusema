'use strict';

var Comment = kusema.models.Comment;

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
        this.callback(this.commentFactory.createComments(newContent.comments));
    }
}
CommentSubscription.prototype.cancel = function() {
    this.socketFactory.unwatchContent(this.baseContent);
}


var CommentFactory = function($http, socketFactory, kusemaConfig) {
        this.urlBase = kusemaConfig.url()+'api/comments';
        this.socketFactory = socketFactory;
        this.$http = $http;

        // commentFactory.questions = {
        //   numberOfRequestsForQuestions: 1,
        //   questionsList: []
        // };

        // // Populate the questionList
        // commentFactory.getNextTenQuestions(0)
        // .success(function (quest) {
        //   commentFactory.questions.questionList = quest;
        // })
        // .error(function (error) {
        //   console.log('Unable to load questions: ' + error.message);
        // });

        return this;
    }

    CommentFactory.prototype.getComments = function (id) {
        return this.$http.get(this.urlBase + '/' + id);
    };

    CommentFactory.prototype.add = function (comment) {
        return this.$http.post(this.urlBase + '/' + comment.parent, comment);
    };

    // TODO
    CommentFactory.prototype.update = function (id, editedComment) {
        return this.$http.put(this.urlBase + '/' + id, editedComment);
    };

    // TODO
    CommentFactory.prototype.upVote = function (id) {
      return this.$http.put(this.urlBase + '/upvote/' + id);
    };

    // TODO
    CommentFactory.prototype.downVote = function (id) {
      return this.$http.put(this.urlBase + '/dnvote/' + id);
    };

    CommentFactory.prototype.delete = function (commentId) {
        return this.$http.delete(this.urlBase + '/' + commentId);
    };

    CommentFactory.prototype.createComments = function(responseJSON) {
        return responseJSON.map(this.createClientModel.bind(this));
    }

    CommentFactory.prototype.createClientModel = function(responseJSON) {
        return new Comment(responseJSON, this);
    }

    CommentFactory.prototype.subscribeTo = function(baseContent, callback) {
        return new CommentSubscription(this.socketFactory, this, baseContent, callback);
    }
//} CommentFactory 

kusema.service('commentFactory', ['$http' , 'socketFactory', 'kusemaConfig', CommentFactory]);
