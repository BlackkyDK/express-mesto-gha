const express = require('express');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');

const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myDB');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = { _id: '62dee506a7aff95bb45c420d' };
  next();
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log('сервер Express запущен');
});
