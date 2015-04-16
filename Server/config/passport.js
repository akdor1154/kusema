var LocalStrategy   = require('passport-local').Strategy;
var LdapStrategy    = require('passport-ldapauth');
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
            
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {

                // Check if user already exits
                User.findOne({ 'local.username' :  username }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, { message: 'That username is already taken.' });
                    } else {
                        var newUser            = new User();
                        newUser.local.username = username;
                        newUser.local.password = newUser.generateHash(password);
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

            User.findOne({ 'local.username' :  username }, function(err, user) {
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


    var OPTS = {
      server: {
        url: 'ldap://directory.monash.edu.au/',
        bindDn: '',
        bindCredentials: '',
        searchBase: 'ou=Student, o=Monash University, c=AU',
        searchFilter: '(uid={{username}})'
      }
    }

    passport.use(new LdapStrategy(OPTS));

};
