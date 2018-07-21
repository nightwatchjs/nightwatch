const JsonWire = require('./jsonwire.js');

class Selenium2Protocol extends JsonWire {
  get defaultPathPrefix() {
    return '/wd/hub';
  }
}

module.exports = Selenium2Protocol;