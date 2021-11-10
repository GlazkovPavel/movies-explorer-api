require('dotenv').config();

const { ADDRESS_BD, NODE_ENV } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const errorHanding = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const { routes } = require('./routes/rout');
const mongoUrl = require('./middlewares/mongoUrl');

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

app.use('*', cors());

mongoose.connect(NODE_ENV === 'production' ? ADDRESS_BD : mongoUrl);

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(requestLogger);

app.use(limiter);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHanding);

app.listen(PORT, () => {
  console.log(`"работает на ${PORT} порту`);
  console.log(BASE_PATH);
});
