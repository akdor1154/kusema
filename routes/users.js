var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server ('localhost', 27017, {auto_reconnect: true});
db = new Db('discussions', server);

// Connect to database and populate if needed
db.open(function (err, db) {
	if(!err) {
		console.log('Connected to \'discussions\' database');
		db.collection('questions', {strict:true}, function(err, collection) {
			if (err) {
				console.log('the question collection does not exist yet... Ill try to make one now');
				populate();
			}
		});
	}
});

exports.findAll = function(req, res) {
	db.collection('questions', function (err, collection) {
		collection.find().toArray(function(err, items) {
			res.send(items);
		});
	});
};

exports.nextTenQuestions = function(req, res) {
	var requestNumber = parseInt(req.params.requestNumber);
	db.collection('questions', function (err, collection) {
		collection.find().sort({score:-1}).skip( requestNumber*10 ).limit(10).toArray(function(err, items) {
			res.send(items);
		});
	});
};

exports.findById = function(req, res) {
	var id = req.params.id;
	db.collection('questions', function (err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
			res.send(item);
		});
	});
};

exports.addQuestion = function(req, res) {
	var question = req.body;
  question.date = new Date();
	question.score = 0;
	console.log(question);
	db.collection('questions', function (err, collection) {
		collection.insert(question, {safe:true}, function (err, result) {
			if (err) {
				res.send({'error':'Error adding question'});
			} else {
				res.send(result[0]);
			}
		});
	});
};

exports.updateQuestion = function(req, res) {
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

exports.deleteQuestion = function(req, res) {
	var id = req.params.id;
	db.collection('questions', function (err, collection) {
		collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function (err, result) {
			if (err) {
				res.send({'error':'Error deleting question'});
			} else {
				res.send(req.body);
			}
		});
	});	
};

exports.upVote = function(req, res) {
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

exports.dnVote = function(req, res) {
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
 
var questions = [
    {
      title: 'I made this forum! ... And I would like your feedback on how useful it is! Also feel free to give me huge amounts of money. I am always happy to accept money.',
      author: 'nathansherburn',
      comment: 'hello bananas everyone from nathan!'
    },
    {
      author: 'jon_li',
      title: 'who likes bananas!?',
      comment: 'hello everyone from jon!'
    },
    {
      author: 'jamie28',
      title: 'I teach eng1030 And I would like your feedback on how useful it is',
      comment: 'hello lorum everyone from jamie!'
    },
    {
      author: 'ashan123',
      title: 'Hi my name is Ashan',
      comment: 'hello everyone bananas from ashan!'
    },
    {
      author: 'don25',
      title: 'this is my first post',
      comment: 'hello everyone from don!'
    },
    {
      author: 'jon_li',
      title: 'hello hello hello!?',
      comment: 'hello hello everyone from jon hello!'
    },
    {
      author: 'jamie28',
      title: 'This is a title from Jamie! And I would like your feedback on how useful it is',
      comment: 'hello everyone bananas again from jamie!'
    },
    {
      author: 'ashan123',
      title: 'Hi I am posting to the forum',
      comment: 'hello everyone from ashan hello, hello!'
    },
    {
      author: 'don2225',
      title: 'this is my second post',
      comment: 'hello everyone bananas again from don!'
    },
    {
      title: 'I made this forum! ... And I would like your feedback on how useful it is! Also feel free to give me huge amounts of money. I am always happy to accept money.',
      author: 'nathansherburn',
      comment: 'hello everyone lorum from nathan!'
    },
    {
      author: 'jon_li',
      title: 'who likes bananas!?',
      comment: 'hello everyone lorum bananas from jon!'
    },
    {
      author: 'jamie287',
      title: 'I teach eng1030 always',
      comment: 'hello everyone from jamie hello from hello!'
    },
    {
      author: 'ashan123123',
      title: 'Hi my name is Ashan And I would like your feedback on how useful it is',
      comment: 'hello everyone lorum from ashan!'
    },
    {
      author: 'don255',
      title: 'this is my first post',
      comment: 'hello everyone lorum from don!'
    },
    {
      author: 'jon_li_00',
      title: 'hello hello hello!?',
      comment: 'hello hello lorum everyone from jon hello!'
    },
    {
      author: 'jamie728',
      title: 'This is a title from Jamie! And I would like your feedback on how useful it is',
      comment: 'hello everyone lorum again from jamie!'
    },
    {
      author: 'ashan1723',
      title: 'Hi I am posting to the forum',
      comment: 'hello everyone lorum from ashan hello, hello!'
    },
    {
      author: 'don625',
      title: 'this is my second post',
      comment: 'hello everyone lorum again from don! And I would like your feedback on how useful it is'
    }
  ];
	 
	db.collection('questions', function(err, collection) {
		collection.insert(questions, {safe:true}, function(err, result) {});
	});
	 
};