const router = require('express').Router();
const {
  validateUserId, validateUserUpdate, validateUserAvatar,
} = require('../middlewares/celebrate');
const {
  getCurrentUser, getUsers, getUserId, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', validateUserId, getUserId);
router.patch('/me', validateUserUpdate, updateUser);
router.patch('/me/avatar', validateUserAvatar, updateAvatar);

module.exports = router;
