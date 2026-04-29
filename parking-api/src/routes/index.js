const router = require('express').Router();


router.use('/auth', require('./authRoutes'));
router.use('/vehicles', require('./vehicleRoutes'));
router.use('/slots', require('./slotRoutes'));
router.use('/reservations', require('./reservationRoutes'));
router.use('/users',        require('./userRoutes'));

module.exports = router;