const express = require('express');
const bodyParser = require('body-parser');

const { errors, celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');

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

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), express.json(), createUser);

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(errors());

app.use((req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('сервер Express запущен');
});
