const Router = require('express');
const router = new Router();
const postController = require('../controllers/postController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), postController.create);
router.put('/:id', checkRole('ADMIN'), postController.update);
router.delete('/:id', checkRole('ADMIN'), postController.deletePost);
router.get('/', postController.getAll);
router.get('/:id', postController.getOne);

module.exports = router;
