const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const AuthError = require('../errors/AuthError');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const NotFound = require('../errors/NotFound');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      throw new Conflict('Пользователь с таким email уже зарегистрирован');
    } else {
      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          email,
          password: hash,
          name,
          about,
          avatar,
        }))
        .then((userData) => res.status(201).send({
          email: userData.email,
          id: userData._id,
          name: userData.name,
          about: userData.about,
          avatar: userData.avatar,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequest('Переданы некорректные данные при создании пользователя'));
          }
          if (err.code === 11000) {
            next(new Conflict('Такой email уже занят'));
          }
          next(err);
        });
    }
  }).catch((err) => {
    next(err);
  });
};

const getUserId = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь по указанному _id не найден.'));
      } else res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequest('Переданы некорректные данные пользователя _id.'));
      } return next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь с таким _id не найден.'));
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные пользователя.'));
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь не найден.'));
      } else res.send(user);
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь не найден.'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-secret', { expiresIn: '7d' });
      if (!user) {
        next(new NotFound('Пользователь не найден.'));
      }
      res.status(200).send({ token });
    })
    .catch(() => next(new AuthError('Неверные почта или пароль')));
};

module.exports = {
  getUsers,
  createUser,
  getUserId,
  updateUser,
  updateAvatar,
  getCurrentUser,
  login,
};
