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
    this.client = null;
    done();
  },

  runExpectAssertion({element = '#weblogin', fn, assertion}) {
    const expect = this.client.api.expect.element(element);
    fn(expect);

    return this.client.start(function() {
      assertion(expect.assertion);
    });
  }
};
