//
// Kusema Server
//
// Written by Nathan Sherburn
// 14/03/2015
//

// Dependencies
var express        = require('express');
var path           = require('path');
var favicon        = require('static-favicon');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var cors           = require('cors');
var passport       = require('passport');
var expressSession = require('express-session');

// Instantiate app
var app            = express();

// Configure socket.io
var server         = require('http').createServer(app);
var io             = require('socket.io')(server);

// Configure database
var dbConfig = require('./config/database.js');
mongoose.connect(dbConfig.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("MongoDB connected.")
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Configure CORs
app.use(cors());

// Configure Passport
require('./config/passport')(passport);
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());  

// Configure middleware
app.use(favicon('../Client/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static('../Client'));

// Add routes
var account = require('./routes/account')(passport);
var api = require('./routes/api');

app.use('/account', account);
app.use('/api', api);

/// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// TODO: Move this out into its own file
// Socket IO events
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

    // Broadcast to everyone in the room/everyone viewing the question
    socket.broadcast.to(data.question_id).emit('new message', data);
  });


  // Remove users from discussion rooms
  socket.on('leave discussion', function (data) {
    socket.leave(data.question_id);
    console.log(data.username + ' left question: ' + data.question_id)
  });

});




/// Error handlers

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


// Export server to be run from "./bin/<script>.js"
// Run "npm test" to start the server
module.exports = server;
