var express = require('express');
var router = express.Router();

var commentsCtrl = require('../controllers/comments');

router.get('/:questionId', commentsCtrl.retrieveAll);
router.post('/:questionId', commentsCtrl.addComment);
router.delete('/:commentId', commentsCtrl.deleteComment); //delete a question
router.put('/upvote/:commentId', commentsCtrl.upVote); //add a comments
router.put('/downvote/:commentId', commentsCtrl.downVote); //add a comments

module.exports = router;