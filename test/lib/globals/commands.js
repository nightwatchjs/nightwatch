const MockServer  = require('../mockserver.js');
const Nightwatch = require('../nightwatch.js');

module.exports = {
  beforeEach(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      Nightwatch.init({silent : true}, client => {
        this.client = Nightwatch.client();
        done();
      });
    });
  },

  afterEach(done) {
    this.server.close(function() {
      done();
    });
  }
};