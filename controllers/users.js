const mongoose = require('mongoose');
const userModel = require('../models/user');

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const createUser = (req, res) => {
  const userData = req.body;

  return userModel.create(userData)
    .then((data) => res.status(HTTP_STATUS.CREATED).send(data))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

const getUsers = (req, res, next) => {
  userModel.find()
    .then((users) => res.status(HTTP_STATUS.OK).send(users))
    .catch((err) => {
      next(err);
    });
};

const getUserById = (req, res) => {
  userModel.findById(req.params.userId)
    .orFail(new mongoose.Error.DocumentNotFoundError())
    .then((user) => res.status(HTTP_STATUS.OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  userModel.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new mongoose.Error.DocumentNotFoundError())
    .then((user) => res.status(HTTP_STATUS.OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  userModel.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(new mongoose.Error.DocumentNotFoundError())
    .then((user) => res.status(HTTP_STATUS.OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};
