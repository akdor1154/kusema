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

// All API routes require auth
//router.use(auth)

// User Routes
router.get('/user/:userId', usersCtrl.findUserById);
router.get('/user/:username', usersCtrl.findUserByUsername);

// Question Routes
router.post('/questions', questionsCtrl.addQuestion);
router.get('/questions/tenMore/:requestNumber', questionsCtrl.nextTenQuestions); // TODO Replace this with feed
router.get('/questions/:questionId', questionsCtrl.findByQuestionId);
router.put('/questions/:questionId', questionsCtrl.updateQuestion);
router.delete('/questions/:questionId', questionsCtrl.deleteQuestion);
router.put('/questions/upvote/:questionId', questionsCtrl.upVoteQuestion);
router.put('/questions/dnvote/:questionId', questionsCtrl.downVoteQuestion);

// Answer Routes
router.get('/answers/:questionId', answersCtrl.findByQuestionId);
router.post('/answers/:questionId', answersCtrl.addByQuestionId);
router.delete('/answers/:answerId', answersCtrl.deleteAnswer);
router.put('/answers/upvote/:answerId', answersCtrl.upVoteAnswer);
router.put('/answers/downvote/:answerId', answersCtrl.downVoteAnswer);

// Comment Routes
router.get('/comments/:questionId', commentsCtrl.findByQuestionId);
router.post('/comments/:questionId', commentsCtrl.addByParentId);
router.delete('/comments/:commentId', commentsCtrl.deleteComment);
router.put('/comments/upvote/:commentId', commentsCtrl.upVoteComment);
router.put('/comments/downvote/:commentId', commentsCtrl.downVoteComment);

// Group Routes
router.get('/groups', groupsCtrl.findAll);
router.post('/groups', groupsCtrl.addGroup);
router.get('/groups/:groupId', groupsCtrl.findById);
router.put('/groups/:groupId', groupsCtrl.updateTopics);
router.delete('/groups/:groupId', groupsCtrl.deleteGroup);

// Topic Routes
router.get('/topics', topicsCtrl.findAll);
router.post('/topics', topicsCtrl.addTopic);
router.get('/topics/:topicId', topicsCtrl.findById);
router.get('/topics/name/:topicName', topicsCtrl.findByName);
router.delete('/topics/:topicId', topicsCtrl.deleteTopic);


module.exports = router;