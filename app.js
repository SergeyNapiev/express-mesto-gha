/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB');
});

const app = express();
const PORT = 3000;

app.use(express.json());

// хардкод авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '652c549db0f96706315dd900', // вставлен _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(usersRouter);
app.use(cardsRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
