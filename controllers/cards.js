const mongoose = require('mongoose');
const cardModel = require('../models/card');

const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return cardModel.create({ name, link, owner: req.user._id })
    .then((card) => res.status(HTTP_STATUS.CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      next(err);
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

const deleteCard = (req, res, next) => {
  cardModel.findById(req.params.cardId)
    .orFail(new mongoose.Error.DocumentNotFoundError())
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('У вас нет прав на удаление этой карточки');
      }
      return cardModel.findByIdAndRemove(req.params.cardId);
    })
    .then((deletedCard) => {
      if (deletedCard) {
        res.status(HTTP_STATUS.OK).send(deletedCard);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные карточки'));
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new mongoose.Error.DocumentNotFoundError())
    .then((updatedCard) => {
      res.status(HTTP_STATUS.OK).json(updatedCard);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new mongoose.Error.DocumentNotFoundError())
    .then((updatedCard) => {
      res.status(HTTP_STATUS.OK).json(updatedCard);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
      }
      next(err);
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
