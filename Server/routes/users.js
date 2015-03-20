var express = require('express');
var router = express.Router();

var usersCtrl = require('../controllers/users');

router.get('/:userId', usersCtrl.findUserById);
router.post('/', usersCtrl.addUser);

module.exports = router;