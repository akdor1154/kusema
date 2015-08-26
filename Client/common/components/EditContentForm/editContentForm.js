var editContentFormDirective = function() {
        return {
            scope: {
                action: '@',
                onCancel: '&',
                onSubmit: '&',
                content: '=',
            },
            templateUrl: 'common/components/EditContentForm/editContentFormTemplate.html',
            controller: 'editContentFormController',
            controllerAs: 'c'
        };
    };
//}

var editContentFormController = function($scope, questionFactory) {
        this.$scope = $scope;
        this.questionFactory = questionFactory;
        this.saveText = 'asdf'
        this.content = {
            title: '',
            message: '',
        };

        if ($scope.action == 'edit') {
            this.content.title = $scope.content.title;
            this.content.message = $scope.content.message;
            this.content._id = $scope.content._id;
            this.saveFunction = this.edit;
            this.saveText = "Edit Question";
        } else {
            this.saveFunction = this.add;
            this.saveText = "Post Question";
        }
        return this;
    }

    editContentFormController.prototype.saveFunction = function() {};

    editContentFormController.prototype.save = function() {
        var promise = this.saveFunction()
                        .then(
                            function (response) {
                                console.log('add succeeded');
                                if (this.$scope.onSubmit) {
                                    var newContent = this.$scope.content.factory.createQuestion(response.data);
                                    this.$scope.onSubmit({'newContent': newContent});
                                }
                            }.bind(this),
                            function (error) {
                                console.log('add error');
                                this.status = 'Unable to add question: ' + error.message;
                            }.bind(this)
                        );
    }

    editContentFormController.prototype.edit = function() {
        console.log('edited');
        return this.questionFactory.updateQuestion(this.content._id, this.content)
    }

    editContentFormController.prototype.add = function() {
        console.log('add attempted');
        return this.questionFactory.addQuestion(this.content)
    }


//}

kusema.addModule('kusema.components.editContent')
    .directive('kusemaEditContentForm', editContentFormDirective)
    .controller('editContentFormController', editContentFormController);