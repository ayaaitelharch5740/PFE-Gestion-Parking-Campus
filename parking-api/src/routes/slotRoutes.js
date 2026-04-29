const router = require('express').Router();
const ctrl   = require('../controllers/slotController');
const auth   = require('../middlewares/authMiddleware');
const role   = require('../middlewares/roleMiddleware');


router.get('/', auth, ctrl.getAllSlots);


router.post('/',  auth, role('admin'), ctrl.createSlot);
router.put('/:id', auth, role('admin'), ctrl.updateSlot);
router.delete('/:id', auth, role('admin'), ctrl.deleteSlot);

module.exports = router;