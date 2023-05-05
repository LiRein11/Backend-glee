const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken');
const { Comment } = require('../models/models');

class CommentController {
  async create(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const { id } = jwt.verify(token, process.env.SECRET_KEY);

      const postId = req.params.id;

      const { text } = req.body;

      const comment = await Comment.create({
        text,
        userId: id,
        postId,
      });

      return res.json(comment);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    const comments = await Comment.findAll();
    return res.json(comments);
  }

  async getCommentsByPost(req, res) {
    const postId = req.params.id;

    const comments = await Comment.findAll({where:{postId}});

    return res.json(comments);
  }
}

module.exports = new CommentController();
