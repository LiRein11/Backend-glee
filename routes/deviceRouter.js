const Router = require('express');
const router = new Router();
const deviceController = require('../controllers/deviceController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), deviceController.create);
router.put('/:id', deviceController.update);
router.get('/', deviceController.getAll);
router.get('/all', deviceController.getAllDevices);
router.get('/:id', deviceController.getOne);

module.exports = router;
