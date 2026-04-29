const router = require('express').Router();
const ctrl   = require('../controllers/reservationController');
const auth   = require('../middlewares/authMiddleware');
const role   = require('../middlewares/roleMiddleware');

router.use(auth);                                          // toutes les routes protégées
router.post('/',           ctrl.create);                   // user
router.get('/my',          ctrl.myList);                   // user
router.patch('/:id/cancel',ctrl.cancel);                   // user
router.get('/',     role('admin','agent'), ctrl.adminList); // admin/agent
router.get('/stats',role('admin'),         ctrl.stats);    // admin seulement

module.exports = router;