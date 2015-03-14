var express = require('express');
var router = express.Router();

var questionsCtrl = require('../controllers/questions');

router.get('/', questionsCtrl.retrieveAll);
router.get('/tenMore/:requestNumber', questionsCtrl.nextTenQuestions);
router.get('/:questionId', questionsCtrl.findById);
router.post('/', questionsCtrl.addQuestion);
router.put('/:questionId', questionsCtrl.updateQuestion);
// router.put('/upvote/:id', questionsCtrl.upVote); //upvote uestion
// router.put('/dnvote/:id', questionsCtrl.dnVote); //downvote a question
// router.delete('/:id', questionsCtrl.deleteQuestion); //delete a question

module.exports = router;