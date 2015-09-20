var editContentFormDirective = function() {
        return {
            scope: {
                onCancel: '&',
                onSubmit: '&',
            },
            bindToController: {
                action: '@',
                contentType: '@',
                outsideContent: '=content',
            },
            templateUrl: 'common/components/EditContentForm/editContentFormTemplate.html',
            controller: 'editContentFormController',
            controllerAs: 'c'
        };
    };
//}

var editContentFormController = function($scope, baseContentService, groupService) {
        this.$scope = $scope;
        this.baseContentService = baseContentService;
        this.initializeContent();
        this._checkContentType();
        this.actionText = 'asdf'
        $scope.groupService = groupService;
        this.groupSearchText = '';
        return this;
    }

    editContentFormController.prototype = Object.create(Object.prototype, {
        action: {
            get: function() {
                return this._action;
            },
            set: function(newAction) {
                this._action = newAction;
                switch(this.action) {
                    case "edit":
                        this.saveFunction = this.edit;
                        this.actionText = "Edit";
                        break;
                    case "create":
                    default:
                        this.saveFunction = this.add;
                        this.actionText = "Post";
                        break;
                }
            }
        },
        contentType: {
            get: function() {
                return this._contentType;
            },
            set: function(newContentType) {
                this._contentType = newContentType;
                this._checkContentType();
            }
        },
        outsideContent: {
            get: function() {
                return this._outsideContent;
            },
            set: function(newContent) {
                if (!newContent) return;
                this.initializeContent();
                this.content.title = newContent.title;
                this.content.message = newContent.message;
                this.content._id = newContent._id;
                this.content.question = newContent.question;
                this.content.group = newContent.group;
                this.content.topics = newContent.topics;
                this._outsideContent = newContent;
            }
        }

    })


    editContentFormController.prototype.initializeContent = function() {
        this.content = (this.content) ? this.content : {
            title: '',
            message: '',
            group: null,
            topics: [],
        };
    }

    editContentFormController.prototype._checkContentType = function() {
        if (!this.baseContentService) return; // sometimes angular calls this before the constructor gets called :/
        this.contentService = this.baseContentService.getService(this.contentType || this.outsideContent);
        this._contentType = (this.contentService) ? this.contentService.model.name : null;
    }

    editContentFormController.prototype.saveFunction = function() {};

    editContentFormController.prototype.save = function() {
        this.sendError = null;
        return  this.saveFunction()
                    .then( function (newContent) {
                        console.log('add succeeded');
                        if (this.$scope.onSubmit) {
                            this.$scope.onSubmit({'newContent': newContent});
                        }
                    }.bind(this) )
                    .catch( function (error) {
                        console.log('add error');
                        this.sendError = error;
                    }.bind(this) );
    }

    editContentFormController.prototype.edit = function() {
        console.log('edited');
        return this.outsideContent.update(this.content)
    }

    editContentFormController.prototype.add = function() {
        console.log('add attempted');
        return this.contentService.add(this.content);
    }

    editContentFormController.prototype.searchGroups = function(searchText) {
        console.log(this.groupService.bindables.groups);
        return this.groupService.bindables.groupsArray;
    }
    editContentFormController.prototype.log = function() {
        console.log('ffs');
    }

//}

import {addModule} from 'kusema';

addModule('kusema.components.editContent')
    .directive('kusemaEditContentForm', editContentFormDirective)
    .controller('editContentFormController', ['$scope', 'baseContentService', 'groupService', editContentFormController]);