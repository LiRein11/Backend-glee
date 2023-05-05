const Router = require('express');
const router = new Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/post/:id', authMiddleware, commentController.create);
router.get('/', commentController.getAll);
router.get('/post/:id', commentController.getCommentsByPost);
// router.put('/:id', checkRole('ADMIN'), commentController.update);
// router.delete('/:id', checkRole('ADMIN'), commentController.deletePost);
// router.get('/:id', commentController.getOne);

module.exports = router;
