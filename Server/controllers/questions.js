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
  // TODO This will be replaced with the feed soon...
  Question.find()
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
  question.group        = req.body.group;
  //question.images.      push(req.body.imageUrl);
  //question.videos.      push(req.body.videoUrl);
  //question.code.        push(req.body.code);
  question.upVotes.     push(req.user._id);

  var topics = req.body.topics;
console.log(topics)
  for (var i in topics) {
  	question.topics.push(topics[i])
  }

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

exp.deleteQuestion = function(req, res, next) {
  
    // TODO add auth info ensure only creator, mods and admin can delete
    var done = function (err, deleted) {
        if(err) return next(err);
        res.json(deleted);
    }

    Question.setAsDeleted(req.params.questionId, req.user._id, done)
};

exp.upVoteQuestion = function(req, res, next) {

    var done = function (err, upVoted) {
        if(err) return next(err);
        res.json(upVoted);
    }

    Question.upVote(req.params.questionId, req.user._id, done)
};

exp.downVoteQuestion = function(req, res, next) {

    var done = function (err, downVoted) {
        if(err) return next(err);
        res.json(downVoted);
    }

    Question.downVote(req.params.questionId, req.user._id, done)
};
