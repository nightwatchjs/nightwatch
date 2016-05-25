var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('pause', {

  'client.pause()' : function(done) {
    var client = Nightwatch.api();

    client.pause(10, function() {
      done();
    });

    Nightwatch.start();
  }
});