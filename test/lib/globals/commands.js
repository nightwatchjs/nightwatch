const MockServer  = require('../mockserver.js');
const Nightwatch = require('../nightwatch.js');

const Commands = {
  beforeEach(done, settings = {}) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      Nightwatch.initClient(Object.assign({
        desiredCapabilities: {
          name: 'testSuite'
        },
        selenium: {
          port: 10195,
          start_process: false
        },
        output: process.env.VERBOSE === '1' || false,
        silent: false
      }, settings))
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

module.exports = Commands;
