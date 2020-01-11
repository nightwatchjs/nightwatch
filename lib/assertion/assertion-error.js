const AssertionError = require('assertion-error');

class NightwatchAssertError extends AssertionError {
  constructor(message) {
    super(message);

    this.name = 'NightwatchAssertError';
  }
}

module.exports = NightwatchAssertError;
