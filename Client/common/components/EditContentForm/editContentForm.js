var editContentFormDirective = function() {
        return {
            scope: {
                action: '@',
                onCancel: '&',
                onSubmit: '&',
                content: '=',
                contentType: '@',
            },
            templateUrl: 'common/components/EditContentForm/editContentFormTemplate.html',
            controller: 'editContentFormController',
            controllerAs: 'c'
        };
    };
//}

var editContentFormController = function($scope, baseContentService) {
        this.$scope = $scope;
        this.contentType = $scope.contentType || $scope.content;
        this.contentService = baseContentService.getService(this.contentType);
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
                            function (newContent) {
                                console.log('add succeeded');
                                if (this.$scope.onSubmit) {
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
        return this.$scope.content.update(this.content)
    }

    editContentFormController.prototype.add = function() {
        console.log('add attempted');
        return this.contentService
                    .add(this.content)
                    .then(this.contentService.createClientModel(this));
    }


//}

kusema.addModule('kusema.components.editContent')
    .directive('kusemaEditContentForm', editContentFormDirective)
    .controller('editContentFormController', ['$scope', 'baseContentService', editContentFormController]);