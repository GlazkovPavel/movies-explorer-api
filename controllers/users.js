const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user')
const NotFoundError = require("../errors/not-found-err");
const BadRequestErr = require("../errors/bad-request-err");
const ConflictErr = require("../errors/conflict-err");
const UnauthorizedErr = require("../errors/unauthorized-err");

const saltRounds = 10;


module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestErr('Произошла ошибка валидации');
      }
    })
    .catch(next);
}

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.email, about: req.body.password },
    { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.send({ user: {
          name: user.name,
          email: user.email
        } });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestErr('Произошла ошибка валидации');
      }
    })
    .catch(next);
}

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictErr('Пользователь с таким email уже существует');
      }
      return bcrypt.hash(password, saltRounds);
    })
    .then((hash) => User.create({
      email, password: hash, name,
    })
      .then((user) => res.status(200).send({
        user: {
          email: user.email,
          name: user.name,
          _id: user._id,
        },
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestErr('Введены невалидные данные');
        }
        return next(err);
      }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedErr('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedErr('Неправильные почта или пароль');
          }
          return user;
        });
    })
    .then((verifiedUser) => {
      const token = jwt.sign({ _id: verifiedUser._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};

