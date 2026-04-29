const router = require('express').Router();
const db     = require('../config/db');
const auth   = require('../middlewares/authMiddleware');
const role   = require('../middlewares/roleMiddleware');

router.get('/', auth, role('admin'), async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) { next(err); }
});

module.exports = router;