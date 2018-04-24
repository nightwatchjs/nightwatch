const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('window', function() {
  beforeEach(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.closeWindow()', function(done) {
    this.client.api.closeWindow(function callback() {
    });

    this.client.start(done);
  });

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
    this.client.api.resizeWindow(100, 100, function callback() {
    });

    this.client.start(done);
  });
});
