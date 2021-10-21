const User = require('../models/user')
const NotFoundError = require("../errors/not-found-err");
const BadRequestErr = require("../errors/bad-request-err");

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
