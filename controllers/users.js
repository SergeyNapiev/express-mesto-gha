/* eslint-disable no-console */
const userModel = require('../models/user');

const createUser = (req, res) => {
  const userData = req.body;
  // console.log(userData);

  return userModel.create(userData)
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      // console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

const getUsers = (req, res) => {
  userModel.find()
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

const getUserById = (req, res) => {
  const { _id } = req.params;
  userModel.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      // console.log(err);
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

const updateUser = (req, res) => {
  const userData = req.body;
  const userId = req.user._id;

  userModel.findByIdAndUpdate(userId, userData, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  userModel.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};
