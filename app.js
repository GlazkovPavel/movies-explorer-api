require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const { movies } = require("./routes/movies");
const {users} = require("./routes/users");
const errorHanding = require('./middlewares/error');
const {authorization} = require("./routes/authorization");
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const wrong = require('./routes/wrong-requests');


const { PORT = 3001, BASE_PATH } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

app.use(requestLogger);

app.use('/', authorization);

app.use(auth)

app.use('/movies', movies);
app.use('/users', users);
app.use('*', wrong);

app.use(errorLogger);

app.use(errors());

app.use(errorHanding);

app.listen(PORT, () => {
  console.log(`"работает на ${PORT} порту`);
  console.log(BASE_PATH);
});
