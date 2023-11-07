const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regex = require('../models/regex');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUsersMe,
} = require('../controllers/users');

usersRouter.get('/me', getUsersMe);

usersRouter.get('/', getUsers);

usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().min(24).max(24).hex()
      .required(),
  }),
}), getUserById);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regex),
  }),
}), updateAvatar);

module.exports = usersRouter;
