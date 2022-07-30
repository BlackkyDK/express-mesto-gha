const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: 'Переданы некорректные данные при создании карточки.' });
      }

      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные карточки' });
      }
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      return;
    }
    res.status(200).send(card);
  }).catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      return;
    }
    res.status(500).send({ message: 'Ошибка по умолчанию.' });
  });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      return;
    }
    res.status(200).send(card);
  }).catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      return;
    }
    res.status(500).send({ message: 'Ошибка по умолчанию.' });
  });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
