const router = require('express').Router();
const ctrl   = require('../controllers/vehicleController');
const auth   = require('../middlewares/authMiddleware');

router.use(auth);
router.get('/', ctrl.getMyVehicles);
router.post('/', ctrl.addVehicle);
router.put('/:id', ctrl.updateVehicle);
router.delete('/:id', ctrl.deleteVehicle);
module.exports = router;