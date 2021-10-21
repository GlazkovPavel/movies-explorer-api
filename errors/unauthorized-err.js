const { NOT_AUTHORIZATION } = require('./errors');

class UnauthorizedErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_AUTHORIZATION;
  }
}

module.exports = UnauthorizedErr;
