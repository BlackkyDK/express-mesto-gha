const router = require('express').Router();
const {
  validateCardCreate, validateCardId,
} = require('../middlewares/celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', validateCardCreate, createCard);

router.delete('/cards/:cardId', validateCardId, deleteCard);

router.put('/cards/:cardId/likes', validateCardId, likeCard);

router.delete('/cards/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
