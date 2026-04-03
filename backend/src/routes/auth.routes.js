const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { login, verify } = require('../controllers/auth.controller');

router.post('/login', login);
router.get('/verify', auth, verify);

module.exports = router;