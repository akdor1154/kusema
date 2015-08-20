var editContentFormDirective = function() {
		return {
			scope: {
				action: '='
			},
			templateUrl: 'common/EditContentForm/editContentFormTemplate.html',
			replace: true,
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
			console.log('you want an edit form');
		} else {
			console.log('you want a create form');
			this.saveFunction = this.add;
			this.saveText = "Post Question";
		}
		return this;
	}

	editContentFormController.prototype.saveFunction = function() {};

	editContentFormController.prototype.save = function() {
		this.saveFunction()
			.success(
				function(response) {
					console.log('add succeeded');
					this.$scope.$emit('EDIT_CONTENT_FORM_SUBMITTED', 'submitted');
				}
			)
			.error(
				function(response) {
					console.log('add error');
					this.status = 'Unable to add question: ' + response.message;
				}
			);
	}

	editContentFormController.prototype.edit = function() {
		console.log('edited');
	}

	editContentFormController.prototype.add = function() {
		console.log('add attempted');
		return this.questionFactory.addQuestion(this.content)
	}


//}

kusema.directive('editContentForm', editContentFormDirective)
	  .controller('editContentFormController', editContentFormController);