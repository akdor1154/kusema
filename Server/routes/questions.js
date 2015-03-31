var express = require('express');
var router = express.Router();

var questionsCtrl = require('../controllers/questions');

router.get('/', questionsCtrl.retrieveAll);
router.post('/', questionsCtrl.addQuestion);
router.get('/tenMore/:requestNumber', questionsCtrl.nextTenQuestions);
router.get('/:questionId', questionsCtrl.findById);
router.put('/:questionId', questionsCtrl.updateQuestion);
router.delete('/:questionId', questionsCtrl.deleteQuestion);
router.put('/upvote/:questionId', questionsCtrl.upVote);
router.put('/dnvote/:questionId', questionsCtrl.downVote);

module.exports = router;