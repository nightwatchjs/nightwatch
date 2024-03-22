const ExpectElement = require('./element.js');

class ExpectComponent extends ExpectElement {
  constructor(...args) {
    super(...args);

    this.flag('component', true);
  }
}

module.exports = ExpectComponent;
