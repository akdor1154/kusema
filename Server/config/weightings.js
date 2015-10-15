// We want to give each user a score for each topic that indicates
// how much they are interested in it. This score ranges from 0 to 1-ish.

// I've implemented this by taking the arctangent
// of the number of times the user does some action
// (so if they read a Javascript question, and they've
// already read four such questions, we might take atan(5).)

// The exact function I am using is 
// score(action) = A / (pi/2) * arctan(k*i), 
// where i is the incidences of the relevant action (e.g. 5 in the previous example)
// and A is the max score we want this action to achieve (so even if they read and read
// and read and read, their score will not exceed A).
//
// k controls how quickly A is approached, or how much each action contributes to the score.
// we compute k by setting some control point:
// "at 10 actions (i), I want the score to be 0.4 (score(action))"
// then solving the score(action) equation for k.
//
// this file sets those constants.

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