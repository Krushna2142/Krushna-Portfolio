const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const c = require('../controllers/project.controller');

router.get('/', c.getAll);                          // public
router.get('/admin', auth, c.adminGetAll);          // admin
router.post('/', auth, c.create);
router.put('/:id', auth, c.update);
router.delete('/:id', auth, c.remove);

module.exports = router;