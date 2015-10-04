var express        	= require('express');
var router        	= express.Router();

// Controllers
var usersCtrl      	= require('../controllers/users');
var questionsCtrl  	= require('../controllers/questions');
var answersCtrl  	= require('../controllers/answers');
var commentsCtrl   	= require('../controllers/comments');
var groupsCtrl	   	= require('../controllers/groups');
var topicsCtrl	   	= require('../controllers/topics');

// Auth middleware
function auth(req, res, next) {
	if (req.isAuthenticated()) return next();
	// Kick un-authed out
	res.status(401);
	res.send("Not logged in.")
}

function authWrite(req, res, next) {
	if (req.method != 'GET') {
		return auth(req, res, next);
	} else {
		return next();
	}
}

// call this with a route controller that returns a promise, for fun and profit.
// function getQuestions(req, res, next) {
//   Question.find()
//   .then( function(q) { res.json(q) } )
//   .catch( function(error) { next(error) }) ;
// }
//
// is equivalent to
// function getQuestionSimple(req) {
//   return Question.find();
// }
//
// jsonRoute(getQuestionsSimple);


function jsonRoute(jsonPromise) {
	return function(req, res, next) {
		jsonPromise(req, res, next)
		.then(function(promiseResult) {
			res.mjson(promiseResult);
		})
		.catch( function(error) {
			console.error(error.stack);
			next(error);
		})
	}
}

var promisedRouter = {};

//now promisedRouter.get('/route', ctrl.doSomething)
//    == router.get('/route', jsonRoute(ctrl.doSomething));
['get','post','put','delete','patch'].forEach(function(action) {
	promisedRouter[action] = function(route, jsonPromise) {
		return router[action](route, jsonRoute(jsonPromise));
	}
});

// All API routes require auth
router.use(authWrite)

// User Routes
promisedRouter.get('/user/:userId', usersCtrl.findUserById);
promisedRouter.get('/user/:username', usersCtrl.findUserByUsername);
promisedRouter.put('/user/:userId/manualSubscriptions', usersCtrl.updateSubscriptions);

// Question Routes
promisedRouter.post('/questions', questionsCtrl.addQuestion);
promisedRouter.get('/questions/tenMore/:requestNumber', questionsCtrl.nextTenQuestions); // TODO Replace this with feed
promisedRouter.get('/questions/tenMore/:groupID/:requestNumber', questionsCtrl.nextTenQuestions); // TODO Replace this with feed
promisedRouter.get('/questions/feed/:requestNumber', questionsCtrl.feed);
promisedRouter.get('/questions/:questionId', questionsCtrl.findByQuestionId);
promisedRouter.put('/questions/:questionId', questionsCtrl.updateQuestion);
promisedRouter.delete('/questions/:questionId', questionsCtrl.deleteQuestion);
promisedRouter.put('/questions/upvote/:questionId', questionsCtrl.upVoteQuestion);
promisedRouter.put('/questions/downvote/:questionId', questionsCtrl.downVoteQuestion);

// Answer Routes
promisedRouter.get('/answers/:questionId', answersCtrl.findByQuestionId);
promisedRouter.post('/answers/:questionId', answersCtrl.addByQuestionId);
promisedRouter.delete('/answers/:answerId', answersCtrl.deleteAnswer);
promisedRouter.put('/answers/:answerId', answersCtrl.updateAnswer);
promisedRouter.put('/answers/upvote/:answerId', answersCtrl.upVoteAnswer);
promisedRouter.put('/answers/downvote/:answerId', answersCtrl.downVoteAnswer);

// Comment Routes
// to be called as comment?questionId=id&answerId=id
promisedRouter.get('/comments', commentsCtrl.findByQAId);
promisedRouter.get('/comments/:commentId', commentsCtrl.findByCommentId);
promisedRouter.post('/comments/:parentId', commentsCtrl.addByQAId);
promisedRouter.delete('/comments/:commentId', commentsCtrl.deleteComment);
promisedRouter.put('/comments/:commentId', commentsCtrl.updateComment);
promisedRouter.put('/comments/upvote/:commentId', commentsCtrl.upVoteComment);
promisedRouter.put('/comments/downvote/:commentId', commentsCtrl.downVoteComment);

// Group Routes
promisedRouter.get('/groups', groupsCtrl.findAll);
promisedRouter.post('/groups', groupsCtrl.addGroup);
promisedRouter.get('/groups/:groupId', groupsCtrl.findById);
promisedRouter.put('/groups/:groupId', groupsCtrl.updateTopics);
promisedRouter.delete('/groups/:groupId', groupsCtrl.deleteGroup);

// Topic Routes
promisedRouter.get('/topics', topicsCtrl.findAll);
promisedRouter.post('/topics', topicsCtrl.addTopic);
promisedRouter.get('/topics/:topicId', topicsCtrl.findById);
promisedRouter.get('/topics/name/:topicName', topicsCtrl.findByName);
promisedRouter.delete('/topics/:topicId', topicsCtrl.deleteTopic);


module.exports = router;