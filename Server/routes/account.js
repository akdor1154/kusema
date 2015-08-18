var express  = require('express');
var router   = express.Router();

module.exports = function (passport) {

	// Account Routes
	
	// These are working but are local logins which will not be used in initial trials
	// router.post('/register', passport.authenticate('local-register'),
	// 	function (req, res) {
	// 		res.json({
	// 			userId: req.user.id,
	// 			username: req.user.username
	// 		});
	// 	}
	// );

	// router.post('/login', passport.authenticate('local-login'),
	// 	function (req, res) {
	// 		res.json({
	// 			userId: req.user.id,
	// 			username: req.user.local.username
	// 		});
	// });

	router.post('/login_monash', passport.authenticate('monash-login'),
		function (req, res) {
			res.json({
				userId: req.user.id,
				username: req.user.authcate
			});
		}
	);

    router.get('/logout',
    	function (req, res) {
     	    req.logout();
        	res.json(true);
    	}
    );


	return router;
};