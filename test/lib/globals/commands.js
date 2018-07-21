const MockServer  = require('../mockserver.js');
const Nightwatch = require('../nightwatch.js');

module.exports = {
  beforeEach(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {

      Nightwatch.initClient({
        webdriver:{
          start_process: false
        },
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