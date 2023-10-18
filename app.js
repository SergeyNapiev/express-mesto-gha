const express = require('express');
const mongoose = require('mongoose');
const appRouter = require('./routes/index');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();
const PORT = 3000;

app.use(express.json());

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
// хардкод авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '652c549db0f96706315dd900',
  };

  next();
});

app.use(appRouter);

app.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Not Found' });
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
