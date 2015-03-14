var express = require('express');
var router = express.Router();

var commentsCtrl = require('../controllers/comments');

// router.get('/comments/:questionId', commentsCtrl.retrieveAll);
// router.post('/comments/:questionId', commentsCtrl.addComment); //add a comments
// router.delete('/comments/:commentId', commentsCtrl.deleteComment); //delete a question
// router.put('/comments/upvote/:commentId', commentsCtrl.upVote); //add a comments
// router.put('/comments/downvote/:commentId', commentsCtrl.downVote); //add a comments

module.exports = router;