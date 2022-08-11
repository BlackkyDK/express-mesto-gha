const router = require('express').Router();
const {
  validateUserId, validateUserUpdate, validateUserAvatar,
} = require('../middlewares/celebrate');
const {
  getCurrentUser, getUsers, getUserId, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/users/me', getCurrentUser);
router.get('/users', getUsers);
router.get('/users/:id', validateUserId, getUserId);

router.patch('/users/me', validateUserUpdate, updateUser);

router.patch('/users/me/avatar', validateUserAvatar, updateAvatar);

module.exports = router;
