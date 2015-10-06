var topicWeightings = {
	readQuestion: {
		asymptote: 0.5,
		score: 0.4,
		scoreAt: 10
	},
	postQuestion: {
		asymptote: 0.5,
		score: 0.3,
		scoreAt: 2
	},
	postAnswer: {
		asymptote: 0.5,
		score: 0.4,
		scoreAt: 2
	},
	postComment: {
		asymptote: 0.4,
		score: 0.3,
		scoreAt: 3
	}
}

for (var action in topicWeightings) {
	weightings = topicWeightings[action];
	console.log('generating '+action);
	console.log(weightings);
	weightings.k = Math.tan( ( Math.PI * weightings.score ) /
	                         ( 2 * weightings.asymptote   ) ) / weightings.scoreAt;
	console.log(weightings);
}

module.exports.topicWeightings = topicWeightings;