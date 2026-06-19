const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const c = require('../controllers/skill.controller');

// Skills
router.get('/', c.getAll);
router.get('/admin', auth, c.adminGetAll);
router.post('/', auth, c.create);
router.put('/:id', auth, c.update);
router.delete('/:id', auth, c.remove);

// Categories
router.get('/categories', c.getCategories);
router.get('/categories/admin', auth, c.adminGetCategories);
router.post('/categories', auth, c.createCategory);
router.put('/categories/:id', auth, c.updateCategory);
router.delete('/categories/:id', auth, c.removeCategory);

module.exports = router;