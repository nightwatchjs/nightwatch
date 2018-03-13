const Errors = require('./jsonwire/errors.js');
const JsonWire = require('./jsonwire.js');

class Selenium2Protocol extends JsonWire {
  get defaultPathPrefix() {
    return '/wd/hub';
  }

  isResultSuccess(result) {
    return result && result.status === Errors.StatusCode.SUCCESS;
  }
}

module.exports = Selenium2Protocol;