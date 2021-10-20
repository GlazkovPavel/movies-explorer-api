const express = require('express');
const mongoose = require("mongoose");


const { PORT = 3001, BASE_PATH } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/movies-explorer');




app.listen(PORT, () => {
  console.log(`"работает на ${PORT} порту`);
  console.log(BASE_PATH);
});
