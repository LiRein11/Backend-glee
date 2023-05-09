const uuid = require('uuid');
const path = require('path');
const ApiError = require('../error/ApiError');
const { Post, Comment, User } = require('../models/models');
const jwt = require('jsonwebtoken');

class PostController {
  async create(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const { id } = jwt.verify(token, process.env.SECRET_KEY);

      let { title, text, quote, miniTitleTwo, miniTitleOne, textMiniOne, textMiniTwo } = req.body;

      const { imageUrl, smallImageUrl } = req.files;
      const fileName = uuid.v4() + '.jpg'; // имя для первого изображения
      const smallFileName = uuid.v4() + '.jpg'; // имя для второго изображения
      imageUrl.mv(path.resolve(__dirname, '..', 'static', fileName));
      smallImageUrl.mv(path.resolve(__dirname, '..', 'static', smallFileName));

      const post = await Post.create({
        title,
        tags: req.body.tags.split(','),
        imageUrl: fileName,
        smallImageUrl: smallFileName,
        text,
        quote,
        miniTitleTwo,
        miniTitleOne,
        textMiniOne,
        textMiniTwo,
        userId: id,
      });

      return res.json(post);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const postId = req.params.id;

      const { imageUrl, smallImageUrl, smallestImageUrl } = req.files;
      const fileName = uuid.v4() + '.jpg'; // имя для первого изображения
      const smallFileName = uuid.v4() + '.jpg'; // имя для второго изображения
      const smallestFileName = uuid.v4() + '.jpg'; // имя для третьего изображения
      imageUrl.mv(path.resolve(__dirname, '..', 'static', fileName));
      smallImageUrl.mv(path.resolve(__dirname, '..', 'static', smallFileName));
      smallestImageUrl.mv(path.resolve(__dirname, '..', 'static', smallestFileName));

      await Post.update(
        {
          title: req.body.title,
          text: req.body.text,
          quote: req.body.quote,
          miniTitleTwo: req.body.miniTitleTwo,
          miniTitleOne: req.body.miniTitleOne,
          textMiniOne: req.body.textMiniOne,
          textMiniTwo: req.body.textMiniTwo,
          imageUrl: fileName,
          smallImageUrl: smallFileName,
          smallestImageUrl: smallestFileName,
          tags: req.body.tags.split(','),
        },
        { where: { id: postId } },
      );

      return res.json('Post обновлён');
    } catch (e) {
      console.error(e);
    }
  }

  async deletePost(req, res) {
    const { id } = req.params;
    const post = await Post.findOne({ where: { id: id } });
    post.destroy();
    return res.json('Post удален');
  }

  async getOne(req, res) {
    try {
      const postId = req.params.id;

      await Post.increment('viewsCount', {
        where: {
          id: postId,
        },
      });

      const post = await Post.findOne({
        where: { id: postId },
        include: [
          {
            model: Comment,
            as: 'postComments',
            include: [{ model: User }],
          },
          {
            model: User,
          },
        ],
      });
      return res.json(post);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить статьи',
      });
    }
  }

  async getAll(req, res) {
    let { limit, page } = req.query;

    // const posts = await Post.findAll();

    page = page || 1;
    limit = limit || 2;
    let offset = page * limit - limit; // отступ
    let posts;

    posts = await Post.findAndCountAll({
      // where: { price: { [Sequelize.Op.between]: [priceMin, priceMax] } },
      limit,
      offset,
    }); // Фильтрация по цене

    return res.json(posts);
  }
}

module.exports = new PostController();
