//
// Kusema Server
//
// Written by Nathan Sherburn
// 14/03/2015
//

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var questions = require('./routes/questions');
var comments = require('./routes/comments');
//var routes = require('./routes/index');
var mongoose = require('mongoose');
var cors = require('cors');

var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

// connect to database
mongoose.connect('mongodb://localhost/kusema');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("MongoDB connected.")
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// enable all cors
app.use(cors());

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);
app.use('/questions', questions);
app.use('/comments', comments);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});




io.on('connection', function (socket) {
  console.log('new connection');

  // Add users to discussion rooms
  socket.on('enter discussion', function (data) {

    // Check if user already joined
    if (socket.rooms.indexOf(data.question_id) === -1) {
      socket.join(data.question_id);
      // console.log(socket.rooms);
    }
  });

  // Wait for new messages then boadcast to room
  socket.on('message sent', function (data) {

    // we tell the client to execute 'new message'
    socket.broadcast.to(data.question_id).emit('new message', data);
  });


  // Remove users from discussion rooms
  socket.on('leave discussion', function (data) {
    socket.leave(data.question_id);
    console.log(data.username + ' left question: ' + data.question_id)
  });

});




/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = server;
