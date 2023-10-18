const mongoose = require('mongoose');
const cardModel = require('../models/card');

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  return cardModel.create({ name, link, owner: req.user._id })
    .then((card) => res.status(HTTP_STATUS.CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

const getCards = (req, res, next) => {
  cardModel.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(HTTP_STATUS.OK).send(cards))
    .catch((err) => {
      next(err);
    });
};

const deleteCard = (req, res) => {
  cardModel.findByIdAndRemove(req.params.cardId)
    .orFail(new mongoose.Error.DocumentNotFoundError())
    .then((card) => res.status(HTTP_STATUS.OK).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки' });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

const likeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(new mongoose.Error.DocumentNotFoundError())
    .then((updatedCard) => {
      res.status(HTTP_STATUS.OK).json(updatedCard);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Карточка с указанным _id не найдена' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Ошибка по умолчанию' });
    });
};

const dislikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(new mongoose.Error.DocumentNotFoundError())
    .then((updatedCard) => {
      res.status(HTTP_STATUS.OK).json(updatedCard);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Карточка с указанным _id не найдена' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
