var express        	= require('express');
var router        	= express.Router();

// Controllers
var usersCtrl      	= require('../controllers/users');
var questionsCtrl  	= require('../controllers/questions');
var answersCtrl  	= require('../controllers/answers');
var commentsCtrl   	= require('../controllers/comments');
var unitsCtrl	   	= require('../controllers/units');
var areasCtrl	   	= require('../controllers/areas');

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
router.get('/questions', questionsCtrl.retrieveAll);
router.post('/questions', questionsCtrl.addQuestion);
router.get('/questions/tenMore/:requestNumber', questionsCtrl.nextTenQuestions);
router.get('/questions/:questionId', questionsCtrl.findById);
router.put('/questions/:questionId', questionsCtrl.updateQuestion);
router.delete('/questions/:questionId', questionsCtrl.deleteQuestion);
router.put('/questions/upvote/:questionId', questionsCtrl.upVote);
router.put('/questions/dnvote/:questionId', questionsCtrl.downVote);

// Answer Routes
router.get('/answers/:questionId', answersCtrl.retrieveAnswersByQuestionId);
router.post('/answers/:questionId', answersCtrl.addAnswerByQuestionId);
router.delete('/answers/:answerId', answersCtrl.deleteAnswer); //delete a question
router.put('/answers/upvote/:answerId', answersCtrl.upVoteAnswer); //add a comments
router.put('/answers/downvote/:answerId', answersCtrl.downVoteAnswer); //add a comments

// Comment Routes
router.get('/comments/:questionId', commentsCtrl.retrieveAll);
router.post('/comments/:questionId', commentsCtrl.addComment);
router.delete('/comments/:commentId', commentsCtrl.deleteComment); //delete a question
router.put('/comments/upvote/:commentId', commentsCtrl.upVote); //add a comments
router.put('/comments/downvote/:commentId', commentsCtrl.downVote); //add a comments

// Unit Routes
router.get('/units', unitsCtrl.retrieveAll);
router.post('/units/new/', unitsCtrl.addUnit);
router.get('/units/tenMore/:requestNumber', unitsCtrl.nextTenUnits);
router.get('/units/:unitId', unitsCtrl.findById);
router.put('/units/:unitId', unitsCtrl.updateUnit);
router.delete('/units/:unitId', unitsCtrl.deleteUnit);

// Area Routes
router.get('/areas', areasCtrl.retrieveAll);
router.post('/areas/new/', areasCtrl.addArea);
router.get('/areas/tenMore/:requestNumber', areasCtrl.nextTenAreas);
router.get('/areas/:areaId', areasCtrl.findById);
router.put('/areas/:areaId', areasCtrl.updateArea);
router.delete('/areas/:areaId', areasCtrl.deleteArea);

module.exports = router;