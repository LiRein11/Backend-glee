const Router = require('express');
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');
const router = new Router();

router.post('/', authMiddleware, ratingController.addRating);
router.get('/', authMiddleware, ratingController.getAll);
router.post('/check', authMiddleware, ratingController.checkRating);

module.exports = router;
