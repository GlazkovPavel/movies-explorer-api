const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {updateUser, getUser} = require("../controllers/users");


users.get('/me', getUser);

users.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(4),
    password: Joi.string().required().min(8)
  })
}) ,updateUser);

module.exports = { users };
