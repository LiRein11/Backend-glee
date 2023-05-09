const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken');
const { Comment, User } = require('../models/models');

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

    const comments = await Comment.findAll({
      where: { postId },
      include: [{ model: User }],
    });

    return res.json(comments);
  }

  async deleteComment(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const { id } = jwt.verify(token, process.env.SECRET_KEY);

      const commentId = req.body;

      const comment = await Comment.findOne({ where: { id: commentId.id } });

      if (id === 14 || id === comment.userId) {
        comment.destroy();
      } else {
        return res.json('Вы не можете удалить комментарий, который вам не принадлежит');
      }

      return res.json('Комментарий удалён');
    } catch (e) {
      return res.json('Удаление не завершено, так как произошла ошибка: ' + e);
    }
  }
}

module.exports = new CommentController();
