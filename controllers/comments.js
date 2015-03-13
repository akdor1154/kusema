var exp = module.exports;

exp.nextTenQuestions = function(req, res) {
	var requestNumber = parseInt(req.params.requestNumber);
	db.collection('questions', function (err, collection) {
		collection.find().sort({score:-1}).skip( requestNumber*10 ).limit(10).toArray(function(err, items) {
			res.send(items);
		});
	});
};

exp.findAll = function(req, res) {
	var id = req.params.id;
	db.collection('comments', function (err, collection) {
		collection.find({'question_id': id}).toArray( function(err, item) {
      console.log(item);
			res.send(item);
		});
	});
};

exp.addComment = function(req, res) {
	var comment = req.body;
  comment.date = new Date();
	comment.score = 0;
	console.log(comment);
	db.collection('comments', function (err, collection) {
		collection.insert(comment, {safe:true}, function (err, result) {
			if (err) {
				res.send({'error':'Error adding comment'});
			} else {
				res.send(result[0]);
			}
		});
	});
};

exp.updateQuestion = function(req, res) {
	var id = req.params.id;
	var question = req.body;

	db.collection('questions', function(err, collection) {
		collection.update({'_id':new BSON.ObjectID(id)}, {$set: {
			title: question.title,
			author: question.author,
			comment: question.comment
		}}, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'Error updating question'});
			} else {
				res.send(question);
			}
		});
	});
};

exp.deleteComment = function(req, res) {
  var commentId = req.params.commentId;

	db.collection('comments', function (err, collection) {
		collection.remove({'_id':new BSON.ObjectID(commentId)}, {safe:true}, function (err, result) {
			if (err) {
				res.send({'error':'Error deleting comment'});
			} else {
				res.send(req.body);
			}
		});
	});	
};

exp.upVote = function(req, res) {
  var id = req.params.id;
  // add auth info

  db.collection('questions', function(err, collection) {
    collection.update({'_id':new BSON.ObjectID(id)}, {$inc:{
      score: 1
    }}, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error':'Error upvoting question'});
      } else {
        res.send(result);
      }
    });
  });
};

exp.dnVote = function(req, res) {
  var id = req.params.id;
  // add auth info

  db.collection('questions', function(err, collection) {
    collection.update({'_id':new BSON.ObjectID(id)}, {$inc:{
      score: -1
    }}, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error':'Error downvoting question'});
      } else {
        res.send(result);
      }
    });
  });
};


// populate the database with sample data
var populate = function() {

	db.collection('questions', function(err, collection) {
		collection.insert({}, {safe:true}, function(err, result) {});
	});
	 
};