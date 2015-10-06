var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require('./user.js');
var Question = require('./question.js');
var BaseContent = require('./common/contentMethods.js').BaseContent;
var weightings = require('../config/weightings.js').topicWeightings;

// Schema definition
var interactionSchema = mongoose.Schema({
    user:           { type: ObjectId, ref: 'User', required: true },
    action:         { type: String, required: true, enum: ['post', 'read'] },
    contentType:    { type: String, required: true, enum: ['Question', 'Comment', 'Answer'] },
    content:        { type: ObjectId, ref: 'BaseContent', required: true},
    topics:         [{ type: String, ref: 'Topic' }],
    date:           { type: Date, required: true, default: Date.now }
})

// Indexes
interactionSchema.index({ user: 1, date: -1 });
interactionSchema.index({ user: 1, contentType: 1});
interactionSchema.index({ content: 1, date: -1});

interactionSchema.statics.log = function(user, action, content, contentType, topics, date) {
	var userId =  (user instanceof User) ? userId = user._id : user;
	var contentId = (content instanceof BaseContent) ? content._id : content;
	if (!contentType && content.__t) {
		contentType = content.__t;
	}
	if (!date && content.dateCreated && action == 'post') {
		date = content.dateCreated;
	}
	var topicPromise;
	if (!topics) {
		if (contentType == 'Question' && content.topics) {
			topicPromise = Promise.resolve(content.topics);
		} else if (contentType == 'Answer' && content.question) {
			topicPromise = Question.findById(content.question).then( function(question) { return question.topics });
		} else if (contentType == 'Comment' && content.parent) {
			topicPromise = content.findRootQuestion.then(function( question ) { return question.topics });
		} else {
			topicPromise = Promise.resolve();
		}
	} else {
		topicPromise = Promise.resolve(topics);
	}

	return topicPromise.then( function(topics) {

		var interaction = new Interaction({
			user: userId,
			action: action,
			contentType: contentType,
			content: contentId,
			topics: topics,
		});
		if (date) {
			interaction.date = date;
		}
		console.log('logging an interaction');
		console.log(interaction);
		return interaction.save()
		.then(function(saved) {
			console.log('logged!');
			Interaction.updateUserStats(interaction);
		})
		.catch( function(error) {
			console.error(error);
		});

	})
}

interactionSchema.statics.updateUserStats = function(interaction) {
		console.log(interaction);
	var topicPromises = interaction.topics.map( function(topic) {
		return Interaction.count({user: interaction.user, action: interaction.action, topics: topic, contentType: interaction.contentType})
		.then(function(count) {
			if (!interaction.isNew) {
				count -= 1;
			}
			var w = weightings[interaction.action+interaction.contentType];
			console.log('w: ');
			console.log(w);
			console.log('count: ');
			console.log(count);
			var y = 1 / ( w.k * Math.pow(count,2) + w.k * count + 1/w.k );
			console.log('y: '+y)
			var scoreToAdd = w.asymptote * 2 / Math.PI * Math.atan(y);
			console.log('scoreToAdd: '+scoreToAdd)
			var incOptions = {};
				incOptions['stats.topicScores.'+topic] = scoreToAdd;
			return User.update({_id: interaction.user}, {$inc: incOptions}).exec()
			.then(function(updated) {
				console.log('score incremented for '+topic);
			})
			.catch (function(error) {
				console.error('score increment error');
				console.error(error);
			})
		});
	});
}

var Interaction = mongoose.model('Interaction', interactionSchema);

module.exports = Interaction