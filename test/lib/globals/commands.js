const MockServer  = require('../mockserver.js');
const Nightwatch = require('../nightwatch.js');

module.exports = {
  beforeEach(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      Nightwatch.initClient({
        desiredCapabilities: {
          name: 'testSuite'
        },
        selenium: {
          port: 10195,
          start_process: false
        },
        // output: process.env.VERBOSE === '1' || false,
        output: true,
        silent: false
      })
        .then(client => {
          this.client = client;
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
