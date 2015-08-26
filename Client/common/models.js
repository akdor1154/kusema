'use strict';


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

    BaseContent.prototype = Object.create(Object.prototype, {
        constructor: {writable: false, value: BaseContent, enumerable: false},
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
    });

    BaseContent.prototype.upVote = function() {
        this.factory.upVote(this._id);
        this.upVotes++;       
    };
    BaseContent.prototype.downVote = function() {
        this.factory.downVote(this._id);
        this.downVotes++;          
    };
    BaseContent.prototype.delete = function() {
        this.factory.delete(this._id);   
    };
    BaseContent.prototype.update = function(newJson) {
        return this.factory.update(this._id, newJson)
                .then(function(updated) {
                    this.constructor.call(this, newJson, this.factory);
                    return this;
                }.bind(this));  
 
    };



var Question = function(questionJSON, questionFactory) {
        //we need this to be NON-ENUMERABLE, else we get a circular dependancy when JSON.stringifying. Unfortunately setting non-enumerable on the prototype's property is not enough :(
        BaseContent.call(this, questionJSON, questionFactory);
        return this;
    }

    Question.prototype = Object.create(BaseContent.prototype, {
        constructor: {writable: false, value: Question, enumerable: false},
        title: { writable: true, value: "", enumerable: true },
    })
    Question.prototype.delete = function() {
        BaseContent.delete.call(this, this._id);
        this.factory.questions.delete(this._id);       
    }



var Comment = function(commentJSON, commentFactory) {
		BaseContent.call(this, commentJSON, commentFactory);
    }
    Comment.prototype = Object.create(BaseContent.prototype, {
        constructor: {writable: false, value: Comment, enumerable: false},
        parent: {writable: true, value: 0, enumerable: true},
    })

kusema.models.BaseContent = BaseContent;
kusema.models.Comment = Comment;
kusema.models.Question = Question;