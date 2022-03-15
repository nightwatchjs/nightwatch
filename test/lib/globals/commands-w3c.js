const MockServer  = require('../mockserver.js');
const Nightwatch = require('../nightwatch.js');

module.exports = {
  beforeEach(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      Nightwatch.initClient({
        selenium: {
          port: null,
          host: null,
          start_process: false
        },
        webdriver: {
          port: 10195,
          host: 'localhost'
        },
        output: process.env.VERBOSE === '1' || false,
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
