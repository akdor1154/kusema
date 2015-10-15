import BaseJsonService from './BaseJsonService.js';
import {Group} from 'common/models.js';
import {Injector} from 'kusema.js';

var I = new Injector('topicService');

var GroupService = function() {
		BaseJsonService.call(this);
		I.init();
		this.urlStem = 'api/groups'
		this.bindables = {
			groups: null,
			groupsArray: null, // there are some places where we need to lookup by key, and others where we need an array :(
		}
		this._wait = {};
		this.waitForGroups = new Promise(function(resolve, reject) {
			this._wait.resolve = resolve;
			this._wait.reject = reject;
		}.bind(this));
		this.getAll()
		.catch(function(error) {
			console.log(error);
		});
	}

	GroupService.prototype = Object.create(BaseJsonService.prototype, {
		'model': {writable: false, enumerable: false, value: Group}
	});

	GroupService.prototype.getAll = function() {
		return I.topicService.waitForTopics
		.then(BaseJsonService.prototype.getAll.bind(this))
		.then(function(groups) {
			this.bindables.groups = {};
			this.bindables.groupsArray = [];
			for (var group of groups) {
				this.bindables.groups[group._id] = group;
				this.bindables.groupsArray.push(group);
			}
			this._wait.resolve();
			return this.bindables.groups;
		}.bind(this));
	}

	GroupService.prototype.getTopics = function(topics) {
		return I.topicService.getTopics(topics);
	}
	GroupService.prototype.getTopic = function(topic) {
		return I.topicService.getTopic(topic);
	}

	GroupService.prototype.getGroup = function(groupID) {
		try {
			return this.bindables.groups[groupID];
		} catch(e) {
			return null;
		}
	}
	GroupService.prototype.getGroups = function(groupsIDs) {
		return groupsIDs.map(this.getGroup.bind(this));
	}
	GroupService.prototype._filterList = function(substr, list) {
		substr = substr.toLowerCase();
		if (list.filter) {
			return list.filter(
				(thing) => (thing.getString().toLowerCase().indexOf(substr) > -1)
			);
		} else {
			return [];
		}
	}
	GroupService.prototype.filterGroups = function(substr) {
		return this._filterList(substr, this.bindables.groupsArray);
	}
	GroupService.prototype.filterTopics = function(substr) {
		return this._filterList(substr, I.topicService.bindables.topicsArray);
	}

import kusema from 'kusema.js';
kusema.service('groupService', GroupService);

export default GroupService;