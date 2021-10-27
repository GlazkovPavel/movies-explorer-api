const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { updateUser, getUser } = require('../controllers/users');

users.get('/users/me', getUser);

users.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

module.exports = { users };
