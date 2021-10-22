const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {updateUser, getUser, createUser} = require("../controllers/users");


users.get('/me', getUser);

users.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8)
  })
}) ,updateUser);

module.exports =  { users };
