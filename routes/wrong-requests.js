const wrong = require('express').Router();
const NotFoundError = require('../errors/not-found-err');

wrong.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = wrong;
