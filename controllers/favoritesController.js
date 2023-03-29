const { Device, User } = require('../models/models');
const jwt = require('jsonwebtoken');

class FavoritesController {
  async toggleFavorites(req, res) {
    try {
      const { deviceId } = req.params;
      const token = req.headers.authorization.split(' ')[1];
      const { id } = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findOne({ where: { id } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const device = await Device.findOne({ where: { id: deviceId } });
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }

      const favorites = user.favorites; // преобразование ID в числа

      user.update({
        favorites: favorites.includes(deviceId)
          ? favorites.filter((id) => id !== deviceId)
          : [...favorites, deviceId],
      });
      // возвращаем успешный ответ с обновленным пользователем
      return res.json(user);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getFavorites(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const { id } = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findOne({ where: { id } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const favorites = user.favorites || [];
      const ids = favorites.map((id) => parseInt(id)).filter((id) => !isNaN(id));
      const devices = await Device.findAll({ where: { id: ids } });
      return res.json(devices);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new FavoritesController();
