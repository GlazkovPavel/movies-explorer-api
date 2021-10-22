const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const { movies } = require("./routes/movies");
const {users} = require("./routes/users");
const errorHanding = require('./middlewares/error');



const { PORT = 3001, BASE_PATH } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/movies', movies);
app.use('/users', users);


app.use(errorHanding);

app.listen(PORT, () => {
  console.log(`"работает на ${PORT} порту`);
  console.log(BASE_PATH);
});
