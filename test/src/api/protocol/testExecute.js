var assert = require('assert');
var common = require('../../../common.js');
var MockServer  = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('client.execute', {
  beforeEach: function () {
    this.client = Nightwatch.client();
    this.protocol = common.require('api/protocol.js')(this.client);
  },

  testExecuteString : function(done) {
    var protocol = this.protocol;

    var command = protocol.execute('<script>test();</script>', ['arg1'], function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"script":"<script>test();</script>","args":["arg1"]}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/execute');
  },

  testExecuteFunction : function(done) {
    var protocol = this.protocol;

    var command = protocol.execute(function() {return test();},
      ['arg1'], function callback() {
        done();
      });

    assert.equal(command.data, '{"script":"var passedArgs = Array.prototype.slice.call(arguments,0); ' +
      'return function () {return test();}.apply(window, passedArgs);","args":["arg1"]}');
  },

  testExecuteFunctionNoArgs : function(done) {
    var protocol = this.protocol;

    var command = protocol.execute(function() {return test();})
      .on('complete', function() {
        done();
      });

    assert.equal(command.data, '{"script":"var passedArgs = Array.prototype.slice.call(arguments,0); ' +
      'return function () {return test();}.apply(window, passedArgs);","args":[]}');
  },

  testExecuteAsyncFunction : function() {
    var protocol = this.protocol;

    var command = protocol.executeAsync(function() {return test();}, ['arg1']);

    assert.equal(command.data, '{"script":"var passedArgs = Array.prototype.slice.call(arguments,0); ' +
      'return function () {return test();}.apply(window, passedArgs);","args":["arg1"]}');
  },

  testExecuteAsync : function(done) {
    var protocol = this.protocol;

    var command = protocol.executeAsync('<script>test();</script>', ['arg1'], function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"script":"<script>test();</script>","args":["arg1"]}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/execute_async');
  }
});
