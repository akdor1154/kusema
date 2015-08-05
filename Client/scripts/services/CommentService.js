'use strict';

var CommentDataPrototype = Object.create(Object.prototype, {
    _id: {writable: true, value: 0, enumerable: true},
    _questionId: {writable: true, value: 0, enumerable: true},
    author: { writable: true, value: 0, enumerable: true }, //TODO add object ID requirement here
    message: { writable: true, value: 0, enumerable: true },
    dateCreated: { writable: true, value: 0, enumerable: true },
    dateModified: { writable: true, value: 0, enumerable: true },
    upVotes: { writable: true, value: 0, enumerable: true },
    downVotes: { writable: true, value: 0, enumerable: true},
})

//TODO: this is almost identical to Question in QuestionService, maybe we could use a mixin?
var Comment = function(commentJSON, commentFactory) {
        //we need this to be NON-ENUMERABLE, else we get a circular dependancy when JSON.stringifying. Unfortunately setting non-enumerable on the prototype's property is not enough :(
        Object.defineProperty(this, 'cf', {writable:true, value:null, enumerable: false});
        this.cf = commentFactory;
        for (var property in CommentDataPrototype) {
            if (commentJSON[property] !== undefined) {
                this[property] = commentJSON[property];
            }
        }
        return this;
    }
    Comment.prototype = Object.create(CommentDataPrototype, {
        cf: {writable: true, value: null, enumerable: false},
        score: {get: function() {
            return this.upVotes - this.downVotes;
        }},
    });
    Comment.prototype.upVote = function() {
        this.cf.upVoteComment(this._id);
        this.upVotes++;       
    }
    Comment.prototype.downVote = function() {
        this.cf.downVoteComment(this._id);
        this.downVotes++;          
    }
    Comment.prototype.delete = function() {
        this.cf.deleteComment(this._id);   
    }
//} Question

kusema.factory('commentFactory', ['$http' , '$routeParams', 'socketFactory', 'kusemaConfig', function($http, $routeParams, socketFactory, kusemaConfig) {
    var commentFactory = {};
    var urlBase = kusemaConfig.url()+'api/comments';

    commentFactory.getComments = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    commentFactory.addComment = function (id, comment) {
        socketFactory.emit('message sent', comment.message);
        return $http.post(urlBase + '/' + id, comment);
    };

    // TODO
    commentFactory.updateComment = function (id, editedComment) {
        return $http.put(urlBase + '/' + id, editedComment);
    };

    // TODO
    commentFactory.upVoteComment = function (id) {
      return $http.put(urlBase + '/upvote/' + id);
    };

    // TODO
    commentFactory.downVoteComment = function (id) {
      return $http.put(urlBase + '/dnvote/' + id);
    };

    commentFactory.deleteComment = function (commentId) {
        return $http.delete(urlBase + '/' + commentId);
    };

    commentFactory.createComment = function(responseJSON) {
        return new Comment(responseJSON, this);
    }

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


    return commentFactory;
}])
