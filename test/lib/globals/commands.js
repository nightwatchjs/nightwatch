var MockServer  = require('../mockserver.js');
var Nightwatch = require('../nightwatch.js');
var common = require('../../common.js');

module.exports = {
  beforeEach : function(done) {
    this.server = MockServer.init();

    this.server.on('listening', function() {
      Nightwatch.init({silent : true}, function() {
        done();
      });
    });
  },

  afterEach : function(done) {
    this.server.close(function() {
      done();
    });
  }
};