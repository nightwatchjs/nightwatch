var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('freeze', {

  'client.freeze()' : function() {
    var client = Nightwatch.api();

    client.freeze();

    Nightwatch.start();
  }
});
