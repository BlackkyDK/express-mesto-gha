const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { errors } = require('celebrate');
const { validateUserCreate, validateUserLogin } = require('./middlewares/celebrate');

const auth = require('./middlewares/auth');

const NotFound = require('./errors/NotFound');
const errorHandler = require('./middlewares/error-handler');

const app = express();
const { PORT = 3000 } = process.env;

const { createUser, login } = require('./controllers/users');

mongoose.connect('mongodb://localhost:27017/myDB');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   req.user = { _id: '62dee506a7aff95bb45c420d' };
//   next();
// });
app.post('/signup', validateUserCreate, createUser);
app.post('/signin', validateUserLogin, login);

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use(errors());

app.use((req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('сервер Express запущен');
});
