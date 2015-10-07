import BaseJsonService from './BaseJsonService.js'
import {Topic} from 'common/models.js';

var TopicService = function() {
		BaseJsonService.call(this);
		this.urlStem = 'api/topics'
		this.bindables = {
			topics: null,
			topicsArray: null,
		}
		this._wait = {};
		this.waitForTopics = new Promise(function(resolve, reject) {
			this._wait.resolve = resolve;
			this._wait.reject = reject;
		}.bind(this));
		this.getAll()
		.catch(function(error) {
			console.error(error);
		});
	}

	TopicService.prototype = Object.create(BaseJsonService.prototype, {
		'model': {writable: false, enumerable: false, value: Topic}
	});

	TopicService.prototype.getAll = function() {
		return BaseJsonService.prototype.getAll.call(this)
		.then(function(topics) {
			this.bindables.topics = {};
			this.bindables.topicsArray = [];
			for (var topic of topics) {
				this.bindables.topics[topic._id] = topic;
				this.bindables.topicsArray.push(topic);
			}
			this._wait.resolve();
			return this.bindables.topics;
		}.bind(this));
	}

	TopicService.prototype.getTopic = function(topicID) {
		return this.bindables.topics[topicID];
	}

	TopicService.prototype.getTopics = function(topicIDs) {
		return topicIDs.map(this.getTopic.bind(this));
	}

import kusema from 'kusema.js';
kusema.service('topicService', TopicService);