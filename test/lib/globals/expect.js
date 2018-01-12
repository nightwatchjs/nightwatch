var Nocks = require('../nocks.js');
var Globals = require('../globals.js');
var Nightwatch = require('../nightwatch.js');

module.exports = {
  beforeEach(opts, done) {

    if (arguments.length === 1) {
      done = arguments[0];
      opts = {};
    }

    Nocks.cleanAll().createSession();

    Nightwatch.init(opts, function () {
      done();
    });

    this.client = Nightwatch.client();
  },

  afterEach() {
    Nocks.deleteSession();
  }
};