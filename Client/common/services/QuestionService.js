'use strict';

var Question = kusema.models.Question;

kusema.factory('questionFactory', ['$http' , 'kusemaConfig', function($http, kusemaConfig) {

    var questionFactory = {};
    var urlBase = kusemaConfig.url()+'api/questions';

    questionFactory.getQuestions = function () {
        return $http.get(urlBase);
    };

    questionFactory.getNextTenQuestions = function (requestNumber) {
        return $http.get(urlBase + '/tenMore/' + requestNumber)
                    .then(function(response) {
                        return response.data.map(
                            function(questionJSON) {
                                return this.createQuestion(questionJSON)
                            }.bind(this)
                        );
                    }.bind(this));
    };

    questionFactory.getQuestionById = function (id) {
        return $http.get(urlBase + '/' + id)
                    .then(function(response) {
                        return this.createQuestion(response.data);
                    }.bind(this));
    };

    questionFactory.addQuestion = function (question) {
        return $http.post(urlBase, JSON.stringify(question));
    };

    questionFactory.updateQuestion = function (id, editedQuestion) {
        return $http.put(urlBase + '/' + id, editedQuestion);
    };

    questionFactory.upVoteQuestion = function (id) {
      return $http.put(urlBase + '/upvote/' + id);
    };

    questionFactory.downVoteQuestion = function (id) {
      return $http.put(urlBase + '/dnvote/' + id);
    };

    questionFactory.deleteQuestion = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    questionFactory.createQuestion = function(responseJSON) {
        return new Question(responseJSON, questionFactory);
    }


    questionFactory.questions = {
      numberOfRequestsForQuestions: 1,
      questionsList: [],
      add: function(responseJSON) {
        this.questionsList.push(questionFactory.createQuestion(responseJSON));
      },
      addQuestions: function(questions) {
        this.questionsList = questions;
      },
      delete: function(id) {
        var questionIndex = this.getIndexOf(id);
        if (questionIndex) {
            this.questionsList.splice(questionIndex, 1);
        }
      },
      getIndexOf: function(id) {
        var possibleQuestions = this.questionsList.filter(function(question) {return question._id == id;});
        if (possibleQuestions.length > 0) {
            return possibleQuestions[0]
        } else {
            return null;
        }
      }
    };

    // Populate the questionList
    questionFactory.getNextTenQuestions(0)
    .then(
        function (quest) {
            questionFactory.questions.addQuestions(quest);
        },
        function (error) {
            console.error('Unable to load questions: ' + error + error.message);
        }
    );
    return questionFactory;
}])
