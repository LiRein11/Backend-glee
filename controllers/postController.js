const uuid = require('uuid');
const path = require('path');
const ApiError = require('../error/ApiError');
const { Post, Comment } = require('../models/models');
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

      const { imageUrl, smallImageUrl } = req.files;
      const fileName = uuid.v4() + '.jpg'; // имя для первого изображения
      const smallFileName = uuid.v4() + '.jpg'; // имя для второго изображения
      imageUrl.mv(path.resolve(__dirname, '..', 'static', fileName));
      smallImageUrl.mv(path.resolve(__dirname, '..', 'static', smallFileName));

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

      await Post.increment(
        'viewsCount',
        {
          where: {
            id: postId,
          },
        },
        // {
        //   returnDocument: 'after',
        // },
        // (err, doc) => {
        //   if (err) {
        //     console.log(err);
        //     return res.status(500).json({
        //       message: 'Не удалось вернуть статью',
        //     });
        //   }

        //   if (!doc) {
        //     return res.status(404).json({
        //       message: 'Статья не найдена',
        //     });
        //   }

        //   res.json(doc);
        // },
      );

      const post = await Post.findOne({
        where: { id: postId },
        include: [{ model: Comment, as: 'postComments' }],
      });
      return res.json(post);

      // .populate('user'); // Это всё делается потому что статья может вернутся только если есть просмотр, и поэтому мы перед возвратом добавляем просмотр и потом возвращаем статью
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить статьи',
      });
    }
  }

  async getAll(req, res) {
    const posts = await Post.findAll();
    return res.json(posts);
  }
}

module.exports = new PostController();
