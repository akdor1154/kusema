var LocalStrategy   = require('passport-local').Strategy;
var CasStrategy     = require('passport-cas').Strategy;
var User            = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // Serialize/Deserialize for persistent log-in sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Register a local user
    passport.use('local-register', new LocalStrategy(
        {
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, username, password, done) {
            
            console.log('registering1');
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {
                console.log('registering2');
                // Check if user already exits
                User.findOne({ 'username' :  username }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, { message: 'That username is already taken.' });
                    } else {
                        var newUser            = new User();
                        newUser.username = username;
                        newUser.password = newUser.generateHash(password);
                        newUser.save(function(err) {
                            if (err) throw err;
                            return done(null, newUser);
                        });
                    }
                });    
            });
        }
    ));

    // Local user sign in
    passport.use('local-login', new LocalStrategy(
        {
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
        // callback with username and password from client side form
        function(req, username, password, done) {

            User.findOne({ 'username' :  username }, function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, { message: 'Incorrect username.' });
                if (!user.validPassword(password))
                    return done(null, false, { message: 'Incorrect password.' });

                // username and password matches
                return done(null, user);
            });
        }
    ));

    // Monash authcate user sign in (and register if new)
    passport.use('monash-login', new CasStrategy(
        {
          version: 'CAS3.0',
          ssoBaseURL: 'https://my.monash.edu.au/authentication/cas',
          serverBaseURL: 'http://melts-dev.eng.monash.edu:8002/',
          validateURL: '/serviceValidate'
        },
        // callback with authcate username from Monash CAS server
        function(authcate, done) {
            console.log(authcate);
            User.findOne({ 'authcate' :  authcate.user }, function (err, user) {
                if (err) {
                    console.log('error1');
                    console.log(err);
                    return done(err);
                }
                if (!user) {
                    // return done(null, false, {message: 'Unknown user'});
                    var newUser = new User();
                    newUser.authcate = authcate.user;
                    newUser.save(function(err) {
                        console.log('error2');
                        console.log(err);
                        if (err) throw err;
                        return done(null, newUser);
                    });
                } else {
                    // user exists in system
                    return done(null, user);
                }
            });
        }
    ));


};
