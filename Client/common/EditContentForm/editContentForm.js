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

var editContentFormController = function($scope) {
	this.$scope = $scope;
	this.saveText = 'asdf'
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
		this.saveFunction();
		this.$scope.$emit('EDIT_CONTENT_FORM_SUBMITTED', 'submitted');
	}

	editContentFormController.prototype.edit = function() {
		console.log('edited');
	}

	editContentFormController.prototype.add = function() {
		console.log('added');
	}


//}

kusema.directive('editContentForm', editContentFormDirective)
	  .controller('editContentFormController', editContentFormController);