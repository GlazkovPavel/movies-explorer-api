require('dotenv').config();

const { ADDRESS_BD } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { movies } = require('./routes/movies');
const { users } = require('./routes/users');
const errorHanding = require('./middlewares/error');
const { authorization } = require('./routes/authorization');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const wrong = require('./routes/wrong-requests');
const limiter = require('./middlewares/limiter');

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

mongoose.connect(`${ADDRESS_BD}`);

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(requestLogger);

app.use(limiter);

app.use('/', authorization);

app.use(auth);

app.use('/', movies);
app.use('/', users);
app.use('*', wrong);

app.use(errorLogger);

app.use(errors());

app.use(errorHanding);

app.listen(PORT, () => {
  console.log(`"работает на ${PORT} порту`);
  console.log(BASE_PATH);
});
