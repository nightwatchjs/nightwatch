const Automate = require('./automate.js');

class AutomateTurboScale extends Automate {
  get productNamespace() {
    return 'automate-turboscale/v1';
  }
}

module.exports = AutomateTurboScale;
