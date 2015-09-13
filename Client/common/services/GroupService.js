var GroupService = function($rootScope, $http, topicService, kusemaConfig, loginService) {
		this.initCommonDeps($http, kusemaConfig);
		this.topicService = topicService;
		this.rootScope = $rootScope;
		this.loginService = loginService;
		this.urlBase = 'api/groups'
		this.bindables = {
			groups: null,
			groupsArray: null, // there are some places where we need to lookup by key, and others where we need an array :(
			userGroups: null
		}
		this._wait = {};
		this.waitForGroups = new Promise(function(resolve, reject) {
			this._wait.resolve = resolve;
			this._wait.reject = reject;
		}.bind(this));
		this.getAll();
		this.rootScope.$on('loginChanged', function() {
			this.waitForGroups.then(this.updateUserGroups.bind(this));
		}.bind(this));
	}

	GroupService.prototype = Object.create(BaseJsonService.prototype, {
		'model': {writable: false, enumerable: false, value: Group}
	});

	GroupService.prototype.getAll = function() {
		return BaseJsonService.prototype.getAll.call(this)
		.then(this.topicService.waitForTopics)
		.then(function(groups) {
			this.bindables.groups = {};
			this.bindables.groupsArray = [];
			for (var group of groups) {
				this.bindables.groups[group._id] = group;
				this.bindables.groupsArray.push(group);
			}
			this._wait.resolve();
			this.updateUserGroups();
			return this.bindables.groups;
		}.bind(this));
	}

	GroupService.prototype.getGroup = function(groupID) {
		return this.bindables.groups[groupID];
	}
	GroupService.prototype.getGroups = function(groupsIDs) {
		return groupsIDs.map(function(groupID) { return this.getGroup(groupID) }.bind(this));
	}
	GroupService.prototype.updateUserGroups = function() {
		this.bindables.userGroups =  ( 
			(this.loginService.bindables.loginState > 0)
	     	&& (this.loginService.bindables.user.enrolments)
     	)
     		? this.getGroups(this.loginService.bindables.user.enrolments)
	     	: this.bindables.groups;
	}

kusema.service('groupService', ['$rootScope', '$http', 'topicService', 'kusemaConfig', 'loginService', GroupService]);