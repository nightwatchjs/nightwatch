const Nocks = require('../nocks.js');
const Nightwatch = require('../nightwatch.js');

module.exports = {
  beforeEach(opts, done) {
    if (arguments.length === 1) {
      done = arguments[0];
      opts = {};
    }

    Nocks.cleanAll().createSession().enable();
    Nightwatch.init(opts, function () {
      done();
    });

    this.client = Nightwatch.client();
  },

  afterEach(done) {
    //Nocks.deleteSession();
    Nocks.disable();
    done();
  }
};
