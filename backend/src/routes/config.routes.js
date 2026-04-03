const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const c = require('../controllers/config.controller');

router.get('/', c.getAll);
router.patch('/:key', auth, c.update);

module.exports = router;