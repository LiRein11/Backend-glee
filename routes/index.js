const Router = require('express');
const router = new Router();

const deviceRouter = require('./deviceRouter');
const userRouter = require('./userRouter');
const brandRouter = require('./brandRouter');
const typeRouter = require('./typeRouter');
const basketRouter = require('./basketRouter');
const favoritesRouter = require('./favoritesRouter');
const ratingRouter = require('./ratingRouter');
const orderRouter = require('./orderRouter');
const postRouter = require('./postRouter');
const commentRouter = require('./commentRouter');

router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/brand', brandRouter);
router.use('/device', deviceRouter);
router.use('/basket', basketRouter);
router.use('/favorites', favoritesRouter);
router.use('/post', postRouter);
router.use('/comment', commentRouter);
router.use('/rating', ratingRouter);
router.use('/order', orderRouter);

module.exports = router;
