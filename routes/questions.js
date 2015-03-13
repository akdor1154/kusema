var express = require('express');
var router = express.Router();

var questionsCtrl = require('../controllers/comments');

router.get('/questions', questionsCtrl.findAll); //retrieve all questions
router.get('/questions/nextTenQuestions/:requestNumber', questionsCtrl.nextTenQuestions); //retrieve all questions
router.get('/questions/:id', questionsCtrl.findById); //retrieve questions with id
router.post('/questions', questionsCtrl.addQuestion ); //add a question
router.put('/questions/:id', questionsCtrl.updateQuestion); //update a question
router.put('/questions/upvote/:id', questionsCtrl.upVote); //upvote uestion
router.put('/questions/dnvote/:id', questionsCtrl.dnVote); //downvote a question
router.delete('/questions/:id', questionsCtrl.deleteQuestion); //delete a question

module.exports = router;