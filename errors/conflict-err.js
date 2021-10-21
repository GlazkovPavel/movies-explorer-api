const { EMAIL_CONFLICT } = require('./errors');

class ConflictErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = EMAIL_CONFLICT;
  }
}

module.exports = ConflictErr;
