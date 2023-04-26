const Router = require('express');
const router = new Router();

const checkRole = require('../middleware/checkRoleMiddleware');
const favoritesController = require('../controllers/favoritesController');
const authMiddleware = require('../middleware/authMiddleware');

router.put('/:deviceId', authMiddleware, favoritesController.toggleFavorites);
router.get('/', authMiddleware, favoritesController.getFavorites);
// router.get('/one', authMiddleware, favoritesController.getOneFavoritesBasket);

module.exports = router;
