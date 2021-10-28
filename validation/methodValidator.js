const validator = require('validator');

module.exports.methodValidator = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};
