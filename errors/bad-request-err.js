const { BAD_REQUEST_ERROR } = require('./errors');

class BadRequestErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST_ERROR;
  }
}
module.exports = BadRequestErr;
