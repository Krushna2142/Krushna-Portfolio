const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const c = require('../controllers/contact.controller');

router.post('/', c.send);
router.get('/', auth, c.getAll);
router.patch('/:id/read', auth, c.markRead);
router.delete('/:id', auth, c.remove);

module.exports = router;