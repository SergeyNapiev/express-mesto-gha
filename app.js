const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const appRouter = require('./routes/index');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const regex = require('./models/regex');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

const {
  login,
  createUser,
} = require('./controllers/users');

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
    email: Joi.string().required().email(),
  }),
}), createUser);

app.use(auth);
app.use(appRouter);
app.use(errors());

app.use((req, res, next) => {
  next(new NotFoundError('Not Found'));
});

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
