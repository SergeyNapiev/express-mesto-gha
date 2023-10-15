/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
const cardModel = require('../models/card');

const createCard = (req, res) => {
  const { name, link } = req.body;
  return cardModel.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

const getCards = (req, res) => {
  cardModel.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

const deleteCard = (req, res) => {
  cardModel.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      // console.log(err);
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные карточки' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

const likeCard = (req, res) => {
  if (!req.params.cardId) {
    return res.status(400).json({ message: 'Переданы некорректные данные для постановки лайка' });
  }

  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
    (err, card) => {
      if (err) {
        if (err.name === 'CastError') {
          return res.status(404).json({ message: 'Передан несуществующий _id карточки' });
        }
        return res.status(500).json({ message: 'Ошибка по умолчанию' });
      }

      if (!card) {
        return res.status(404).json({ message: 'Передан несуществующий _id карточки' });
      }

      res.json(card);
    },
  );
};

const dislikeCard = (req, res) => {
  if (!req.params.cardId) {
    return res.status(400).json({ message: 'Переданы некорректные данные для снятия лайка' });
  }

  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
    (err, card) => {
      if (err) {
        if (err.name === 'CastError') {
          return res.status(404).json({ message: 'Передан несуществующий _id карточки' });
        }
        return res.status(500).json({ message: 'Ошибка по умолчанию' });
      }

      if (!card) {
        return res.status(404).json({ message: 'Передан несуществующий _id карточки' });
      }

      res.json(card);
    },
  );
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
