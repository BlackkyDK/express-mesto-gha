const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCurrentUser, getUsers, getUserId, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/users/me', getCurrentUser);
router.get('/users', getUsers);
router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUserId);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]?$/),
  }),
}), updateAvatar);

module.exports = router;
