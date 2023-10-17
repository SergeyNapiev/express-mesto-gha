/* eslint-disable consistent-return */
/* eslint-disable no-console */
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
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

const getUsers = (req, res) => {
  userModel.find()
    .then((users) => res.status(HTTP_STATUS.OK).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

const getUserById = (req, res) => {
  userModel.findById(req.params.userId)
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(HTTP_STATUS.OK).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  if (!name || !about) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
  }

  if (name.length < 2 || name.length > 30) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
  }

  if (about.length < 2 || about.length > 30) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
  }

  userModel.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(HTTP_STATUS.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  userModel.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(HTTP_STATUS.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
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
