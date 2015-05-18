var express  = require('express');
var router   = express.Router();

module.exports = function (passport) {

	// Account Routes
	router.post('/register',
		passport.authenticate('local-register'),
		function (req, res) {
			res.json({
				userId: req.user.id,
				username: req.user.local.username
			});
		}
	);

	router.post('/login', passport.authenticate('local-login'),
		function (req, res) {
		res.json({
			userId: req.user.id,
			username: req.user.local.username
		});
	});

	router.post('/ldapLogin', passport.authenticate('ldapauth'),
		function (req, res) {
		res.json({
			userId: req.user.id,
			username: req.user.monash.username
		});
	});

    router.get('/logout', function (req, res) {
        req.logout();
        res.json(true);
    });


	return router;
};