/* eslint-disable consistent-return */
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
  userModel.findById(req.params.userId)
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  if (name.length < 2 || name.length > 30) {
    return res.status(400).send({ message: 'Имя пользователя должно содержать от 2 до 30 символов' });
  }

  if (about.length < 2 || about.length > 30) {
    return res.status(400).send({ message: 'Информация "about" пользователя должна содержать от 2 до 30 символов' });
  }

  userModel.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении имени пользователя или информации "about"' });
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
