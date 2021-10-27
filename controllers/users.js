const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestErr = require('../errors/bad-request-err');
const ConflictErr = require('../errors/conflict-err');
const UnauthorizedErr = require('../errors/unauthorized-err');
const {
  invalidDataErrorText,
  invalidUserIdErrorText,
  userIdNotFoundText,
  duplicateEmailErrorText,
  wrongCredentialsErrorText,
} = require('../errors/error-text');

const saltRounds = 10;

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(invalidUserIdErrorText);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestErr(invalidDataErrorText);
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const {
    email,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictErr(duplicateEmailErrorText);
      }
      User.findByIdAndUpdate(req.user._id, { email: req.body.email, name: req.body.name },
        { new: true, runValidators: true })
        .then((userMe) => {
          if (!userMe) {
            throw new NotFoundError(userIdNotFoundText);
          }
          return res.send(
            {
              user:
                {
                  name: user.name,
                  email: user.email,
                },
            },
          );
        })
        .catch((err) => {
          if (err.name === 'ValidationError' || err.name === 'CastError') {
            throw new BadRequestErr(invalidDataErrorText);
          }
        });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictErr(duplicateEmailErrorText);
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
          throw new BadRequestErr(invalidDataErrorText);
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
        throw new UnauthorizedErr(wrongCredentialsErrorText);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedErr(wrongCredentialsErrorText);
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
