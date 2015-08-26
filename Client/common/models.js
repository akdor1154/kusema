'use strict';

var BaseContentPrototype = Object.create(Object.prototype, {
    _id: {writable: true, value: 0, enumerable: true},
    author: { writable: true, value: 0, enumerable: true }, //TODO add object ID requirement here
    authorName: { writable: true, value: "", enumerable: true},
    message: { writable: true, value: 0, enumerable: true },
    dateCreated: { writable: true, value: null, enumerable: true },
    dateModified: { writable: true, value: null, enumerable: true },
    comments: { writable: true, value: [], enumerable: true},
    upVotes: { writable: true, value: 0, enumerable: true },
    downVotes: { writable: true, value: 0, enumerable: true},
    score: {get: function() {
        return this.upVotes - this.downVotes;
    }},
})

var BaseContent = function(contentJSON, factory) {
    Object.defineProperty(this, 'factory', {writable:true, value:null, enumerable: false});
    this.factory = factory;
    for (var property in Object.getPrototypeOf(this)) {
        if (contentJSON[property] !== undefined) {
            this[property] = contentJSON[property];
        }
    }
    this.dateCreated = new Date(this.dateCreated);
    this.dateModified = new Date(this.dateModified);
	return this;
}

BaseContent.prototype = BaseContentPrototype;


var QuestionDataPrototype = Object.create(BaseContentPrototype, {
    title: { writable: true, value: "", enumerable: true },
})

var Question = function(questionJSON, questionFactory) {
        //we need this to be NON-ENUMERABLE, else we get a circular dependancy when JSON.stringifying. Unfortunately setting non-enumerable on the prototype's property is not enough :(
        BaseContent.call(this, questionJSON, questionFactory);
        return this;
    }
    Question.prototype.upVote = function() {
        this.factory.upVoteQuestion(this._id);
        this.upVotes++;       
    }
    Question.prototype.downVote = function() {
        this.factory.downVoteQuestion(this._id);
        this.downVotes++;          
    }
    Question.prototype.delete = function() {
        this.factory.deleteQuestion(this._id);
        this.factory.questions.delete(this._id);       
    }
//} Question
Question.prototype = QuestionDataPrototype;

var CommentDataPrototype = Object.create(BaseContentPrototype, {
    parent: {writable: true, value: 0, enumerable: true},
})

//TODO: this is almost identical to Question in QuestionService, maybe we could use a mixin?
var Comment = function(commentJSON, commentFactory) {
		BaseContent.call(this, commentJSON, commentFactory);
    }
    Comment.prototype.upVote = function() {
        this.factory.upVoteComment(this._id);
        this.upVotes++;       
    }
    Comment.prototype.downVote = function() {
        this.factory.downVoteComment(this._id);
        this.downVotes++;          
    }
    Comment.prototype.delete = function() {
        this.factory.deleteComment(this._id);   
    }
//} Comment
Comment.prototype = CommentDataPrototype;

kusema.models.BaseContent = BaseContent;
kusema.models.Comment = Comment;
kusema.models.Question = Question;