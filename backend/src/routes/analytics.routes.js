const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const c = require('../controllers/analytics.controller');

router.post('/track', c.track);
router.get('/dashboard', auth, c.getDashboard);

module.exports = router;