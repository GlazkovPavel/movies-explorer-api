const express = require('express');


const { PORT = 3001, BASE_PATH } = process.env;

const app = express();



app.listen(PORT, () => {
  console.log(`"работает на ${PORT} порту`);
  console.log(BASE_PATH);
});
