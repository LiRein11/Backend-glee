const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.put('/', userController.updateUser);
router.get('/auth', authMiddleware, userController.check);
router.get('/', userController.getAllUsers);
router.get('/info', authMiddleware, userController.getOneUser);

module.exports = router;
