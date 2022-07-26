const express = require('express');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');

const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myDB', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200);
  res.send('Hello 123crtyrturid');
});

app.use((req, res, next) => {
  console.log('12345123412');
  req.user = { _id: '62dee506a7aff95bb45c420d' };
  next();
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.listen(PORT, () => {
  console.log('сервер Express запущен');
});
