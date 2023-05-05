const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Basket, Comment } = require('../models/models');
const uuid = require('uuid');
const path = require('path');

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: '24h',
  });
};
class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest('Некорректный email или password'));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest('Пользователь с таким уже email существует'));
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email, role, password: hashPassword });
    const basket = await Basket.create({ userId: user.id });
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal('Пользователь не найден'));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal('Указан неверный пароль'));
    }
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }

  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    return res.json({ token });
  } // Генерация нового токена, для того, чтобы когда пользователь постоянно использует аккаунт, токен у него перезаписывался

  async getAllUsers(req, res) {
    const users = await User.findAll();
    return res.json(users);
  }

  async updateUser(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const { id } = jwt.verify(token, process.env.SECRET_KEY);

      const { avatarUrl } = req.files;
      let fileName = uuid.v4() + '.jpg';
      avatarUrl.mv(path.resolve(__dirname, '..', 'static', fileName));

      await User.update(
        {
          email: req.body.email,
          name: req.body.name,
          avatarUrl: fileName,
        },
        { where: { id: id } },
      );

      return res.json('User обновлён');
    } catch (e) {
      console.error(e); 
    }
  }

  async getOneUser(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const { id } = jwt.verify(token, process.env.SECRET_KEY);

      const user = await User.findOne({
        where: { id },
        include: [{ model: Comment, as: 'userComments' }],
      });

      return res.json(user);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new UserController();
