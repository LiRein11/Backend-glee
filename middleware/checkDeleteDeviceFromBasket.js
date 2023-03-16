const { Basket, BasketDevice } = require('../models/models');

module.exports = async function (req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;
    const userBasket = await Basket.findOne({ where: { userId: user.id } });
    const deviceItem = await BasketDevice.findOne({
      where: { id: id, basketId: userBasket.id },
    });

    if (deviceItem) {
      return next();
    }
    return res.json("Device didn't find in basket of user");
  } catch (e) {
    res.json(e);
  }
};
