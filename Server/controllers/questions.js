var Question = require('../models/question');

var exp = module.exports;

exp.findByQuestionId = function (req, res, next) {
  var getQuestion = Question.findOne(
    { '_id': req.params.questionId }
  ).exec();

  getQuestion.addBack( function (err, question) {
    if (err) return next(err);
    res.json(question);
  });
};

exp.nextTenQuestions = function (req, res, next) {
  Question.find()
  .sort({ 'upVotes': 1, 'downVotes': -1 })
  .skip(10*req.params.requestNumber)
  .limit(10)
  .exec( function (err, questions) {
    if(err) return next(err);
    res.json(questions)
  });
};

exp.addQuestion = function (req, res, next) {
  
  var question = new Question();

  question.title        = req.body.title;
  question.author       = req.body.author;
  question.anonymous    = req.body.anonymous;
  question.message      = req.body.message;
  question.topics.      push(req.body.topics)
  question.group        = req.body.group;
  //question.images.      push(req.body.imageUrl);
  //question.videos.      push(req.body.videoUrl);
  //question.code.        push(req.body.code);
  question.upvotes.     push(req.user._id);

  question.save( function (err, question) {
    if (err) return next(err);
    res.json(question);
    console.log(question);
  });
};

exp.updateQuestion = function (req, res, next) {
// TODO add auth info ensure only user and admin can update
	console.log(req.body);
  var updateQuestion = Question.update(
    { '_id': new ObjectId(req.params.questionId) },
    { $set: { 'message': req.body.message, 'title': req.body.title, 'dateModified': new Date() }}
  ).exec();

  updateQuestion.addBack( function (err, updated, raw) {
    if (err) return next(err);
    res.json(raw);
  });
};

exp.deleteQuestion = function (req, res, next) {
// TODO add auth info ensure only user and admin can delete
  var deleteQuestion = Question.find(
    { '_id': new ObjectId(req.params.questionId) }
  ).remove().exec();

  deleteQuestion.addBack( function (err, deleted) {
    if (err) return next(err);
    res.json(deleted);
  })
};

exp.upVoteQuestion = function(req, res, next) {
// TODO add auth info ensure 1 vote per person

  var upVote = Question.update(
    { '_id': new ObjectId(req.params.questionId) },
    { $inc: { 'upVotes': 1 }}
  ).exec();

  upVote.addBack( function (err, upVoted) {
    if(err) return next(err);
    res.json(upVoted);
  })

};

exp.downVoteQuestion = function(req, res, next) {
// TODO add auth info ensure 1 vote per person

  var downVote = Question.update(
    { '_id': new ObjectId(req.params.questionId) },
    { $inc: { 'downVotes': 1 }}
  ).exec();

  downVote.addBack( function (err, downVoted) {
    if(err) return next(err);
    res.json(downVoted);
  })

};