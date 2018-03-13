var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

describe('window', function() {

  it('client.closeWindow()', function(done) {
    var client = Nightwatch.api();

    client.closeWindow(function callback() {
      done();
    });

    Nightwatch.start();
  },

  //it('client.switchWindow()', function(done) {
  //  var client = Nightwatch.api();
  //
  //  client.switchWindow(function callback() {
  //    done();
  //  });
  //
  //  Nightwatch.start();
  //},

  it('client.resizeWindow()', function(done) {
    var client = Nightwatch.api();

    client.resizeWindow(100, 100, function callback() {
      done();
    });

    Nightwatch.start();
  }
});
