const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { login, verify, register, forgotPassword, resetPassword } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify', auth, verify);

module.exports = router;