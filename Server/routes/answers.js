var express = require('express');
var router = express.Router();

var answersCtrl = require('../controllers/answers');

router.get('/:questionId', answersCtrl.retrieveAnswersByQuestionId);
router.post('/:questionId', answersCtrl.addAnswerByQuestionId);
router.delete('/:answerId', answersCtrl.deleteAnswer);
router.put('/upvote/:answerId', answersCtrl.upVoteAnswer);
router.put('/downvote/:answerId', answersCtrl.downVoteAnswer);

module.exports = router;