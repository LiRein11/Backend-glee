const Router = require('express');
const router = new Router();
const basketController = require('../controllers/basketController');
const authMiddleware = require('../middleware/authMiddleware');
const checkDeleteDeviceFromBasket = require('../middleware/checkDeleteDeviceFromBasket');

router.post('/', authMiddleware, basketController.addDevice);
router.get('/devices', authMiddleware, basketController.getAllDevices);
router.get('/', basketController.getAllBaskets);
router.get('/one', authMiddleware, basketController.getOneBasket);
router.delete(
  '/devices/:id',
  authMiddleware,
  checkDeleteDeviceFromBasket,
  basketController.deleteDevice,
);
router.delete('/', authMiddleware, basketController.deleteBasket);

module.exports = router;
