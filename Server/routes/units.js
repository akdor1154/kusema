var express = require('express');
var router = express.Router();

var unitsCtrl = require('../controllers/units');

router.get('/units', unitsCtrl.retrieveAll);
router.post('/units/new/', unitsCtrl.addUnit);
router.get('/units/tenMore/:requestNumber', unitsCtrl.nextTenUnits);
router.get('/units/:unitId', unitsCtrl.findById);
router.put('/units/:unitId', unitsCtrl.updateUnit);
router.delete('/units/:unitId', unitsCtrl.deleteUnit);

module.exports = router;