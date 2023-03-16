const Router = require('express');
const orderController = require('../controllers/orderController');

const checkRole = require('../middleware/checkRoleMiddleware');
const router = new Router();

router.post('/', orderController.create);
router.put('/', checkRole('ADMIN'), orderController.updateOrder);
router.delete('/', checkRole('ADMIN'), orderController.deleteOrder);
router.get('/', checkRole('ADMIN'), orderController.getAll);
router.get('/:id', checkRole('ADMIN'), orderController.getOne);

module.exports = router;
