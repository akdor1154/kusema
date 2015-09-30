var express  = require('express');
var router   = express.Router();
var ldap 	= require('../services/ldapClient');

module.exports = function (passport) {

	// Account Routes
	
	//These are working but are local logins which will not be used in initial trials
	router.post('/register_local', passport.authenticate('local-register'),
		function (req, res) {
			res.json({
				userId: req.user.id,
				username: req.user.username
			});
		}
	);

	router.post('/login_local', passport.authenticate('local-login'),
		function (req, res) {
			res.json({
				userId: req.user.id,
				username: req.user.username
			});
	});

	router.get('/login_monash', passport.authenticate('monash-login'),
		function (req, res) {
			var userData = {
				userId: req.user.id,
				username: req.user.authcate
			};
			res.redirect('/monashLoginCallback.html?'+encodeURIComponent(JSON.stringify(userData)))
			res.json();
		}
	);

    router.all('/logout',
    	function (req, res) {
     	    req.logout();
        	res.json(true);
    	}
    );

    router.get('/is_logged_in',
    	function(req, res) {
    		if (!req.user) {
    			return res.json(null);
    		} else {
    			return res.json(req.user);
    		}
    	}
	);


	return router;
};