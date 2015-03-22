var express        = require('express');
var router         = express.Router();

// Controllers
var usersCtrl      = require('../controllers/users');
var questionsCtrl  = require('../controllers/questions');
var commentsCtrl   = require('../controllers/comments');


// Auth middleware
function auth(req, res, next) {
	if (req.isAuthenticated()) return next();
	// Kick un-authed out
	res.json(false);
}

// All API routes require auth
router.use(auth)


// Question Routes
router.get('/questions', questionsCtrl.retrieveAll);
router.post('/questions', questionsCtrl.addQuestion);
router.get('/questions/tenMore/:requestNumber', questionsCtrl.nextTenQuestions);
router.get('/questions/:questionId', questionsCtrl.findById);
router.put('/questions/:questionId', questionsCtrl.updateQuestion);
router.delete('/questions/:questionId', questionsCtrl.deleteQuestion);
router.put('/questions/upvote/:questionId', questionsCtrl.upVote);
router.put('/questions/dnvote/:questionId', questionsCtrl.downVote);

// User Routes
router.get('/user/:userId', usersCtrl.findUserById);
router.get('/user/:username', usersCtrl.findUserByUsername);

// Comment Routes
router.get('/comment/:questionId', commentsCtrl.retrieveAll);
router.post('/comment/:questionId', commentsCtrl.addComment);
router.delete('/comment/:commentId', commentsCtrl.deleteComment); //delete a question
router.put('/comment/upvote/:commentId', commentsCtrl.upVote); //add a comments
router.put('/comment/downvote/:commentId', commentsCtrl.downVote); //add a comments

module.exports = router;