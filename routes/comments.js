var express = require('express');
var router = express.Router();

var commentsCtrl = require('../controllers/comments');

router.get('/comments/:id', commentsCtrl.findAll);
router.post('/comments/:id', commentsCtrl.addComment); //add a comments
router.delete('/comments/:commentId', commentsCtrl.deleteComment); //delete a question

module.exports = router;