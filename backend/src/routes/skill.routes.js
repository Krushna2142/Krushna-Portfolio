const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const c = require('../controllers/skill.controller');

router.get('/', c.getAll);
router.get('/admin', auth, c.adminGetAll);
router.post('/', auth, c.create);
router.put('/:id', auth, c.update);
router.delete('/:id', auth, c.remove);

module.exports = router;