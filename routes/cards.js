const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regex = require('../models/regex');

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(regex),
  }),
}), createCard);

cardsRouter.get('/', getCards);
cardsRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().min(24).max(24).required(),
  }),
}), deleteCard);

cardsRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().min(24).max(24).required(),
  }),
}), likeCard);

cardsRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().min(24).max(24).required(),
  }),
}), dislikeCard);

module.exports = cardsRouter;
