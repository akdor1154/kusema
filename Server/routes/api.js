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
	res.status(401);
	res.send("Not logged in.")
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
router.get('/comments/:questionId', commentsCtrl.retrieveAll);
router.post('/comments/:questionId', commentsCtrl.addComment);
router.delete('/comments/:commentId', commentsCtrl.deleteComment); //delete a question
router.put('/comments/upvote/:commentId', commentsCtrl.upVote); //add a comments
router.put('/comments/downvote/:commentId', commentsCtrl.downVote); //add a comments

module.exports = router;