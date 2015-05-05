var express = require('express');
var router = express.Router();

var areasCtrl = require('../controllers/areas');

router.get('/areas', areasCtrl.retrieveAll);
router.post('/areas/new/', areasCtrl.addArea);
router.get('/areas/tenMore/:requestNumber', areasCtrl.nextTenAreas);
router.get('/areas/:areaId', areasCtrl.findById);
router.put('/areas/:areaId', areasCtrl.updateArea);
router.delete('/areas/:areaId', areasCtrl.deleteArea);

module.exports = router;