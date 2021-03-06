//
// Kusema Server
//
// Written by Nathan Sherburn
// 14/03/2015
//

// Dependencies
function kusema(options) {

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
var fs             = require('fs');

// Instantiate app and server
var app            = express();

var here = function(pathToJoin) {
  return path.join(__dirname, pathToJoin)
}

if (!options) {
  options = {};
}

if (!options.hostname) {
  var os             = require('os');
  options.hostname = os.hostname();
  console.log('I had to take a guess at your hostname, set it in serverConfig.json to the URL hostname that users will use for best results...');
}
if (!options.protocol) {
  options.protocol = 'http';
}

var server;

try {
  if (options.protocol == 'https') {
    var cert = fs.readFileSync(options.cert);
    var certKey = fs.readFileSync(options.certKey);
    server = require('https').createServer({key: certKey, cert: cert}, app);
  } else {
    throw new Error('letsUseHttp');
  }
} catch (e) {
  console.error(e);
  server = require('http').createServer(app);
}

app.options = options;

// Configure database
var dbConfig = require(here('config/database.js'));

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("MongoDB connected.")
});

// View engine setup
app.set('views', here('views'));
app.set('view engine', 'jade');

var corsOptions = {
  origin: true,
  credentials: true
}

// Configure CORs
app.use(cors(corsOptions));

// Configure Passport
require(here('config/passport'))(passport, app.options);
app.use(expressSession({ // TODO add a data store to this
	secret: 'mySecretKey',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());  

// Configure middleware
app.use(favicon(here('../Client/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(here('../Client')));

app.all('/kusema(/*)?', function(req, res) {
  console.log('catchall')
  res.sendfile(here('../Client/index.html'));
});

// add convenience function to autoJSON a mongoose object, probably better places to do it

app.use(function(req, res, next) {
  res.mjson = function(mongooseDocument) {
    if (mongooseDocument.toJSON) {
      res.json(mongooseDocument.toJSON());
    } else if (mongooseDocument[0] && mongooseDocument[0].toJSON) {
      res.json(mongooseDocument.map(function(realDoc) { return realDoc.toJSON();}));
    } else {
      res.json(mongooseDocument);
    }
  };
  next();
});

// Add routes
var account = require(here('./routes/account'))(passport, options);
var api 	= require(here('./routes/api'));
var baucis  = require(here('config/baucis'));

app.use('/account', account);
app.use('/api', api);
app.use('/rest', baucis());

require(here('config/groups'));

/// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// Configure Socket IO
require(here('/config/socketio'))(server);


/// Error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.message);
    console.log(err.stack);
    res.json({
      message: err.message,
      error: err,
      stack: err.stack
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

server.listen(options.port);
console.log('Express server listening on port ' + app.options.hostname+':'+server.address().port);

} // kusema()
// Export server to be run from "./bin/<script>.js"
// Run "npm test" to start the server
module.exports = kusema;
