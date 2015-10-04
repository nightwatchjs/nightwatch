var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var mockery = require('mockery');
var util = require('util');
var events = require('events');

module.exports = {
  setUp : function(done) {
    mockery.enable({ useCleanCache: true, warnOnUnregistered: false });
    function Nightwatch(opts) {
      this.results = {};
      this.terminated = true;
      this.api = {
        currentTest : {}
      };

      this.queue = {
        run : function() {},
        reset : function() {},
        list : function() {
          return [];
        }
      };
    }
    util.inherits(Nightwatch, events.EventEmitter);
    Nightwatch.prototype.start = function() {};
    Nightwatch.prototype.endSessionOnFail = function() {};
    Nightwatch.prototype.printResult = function() {};
    Nightwatch.prototype.clearResult = function() {};
    Nightwatch.prototype.resetTerminated = function() {
      this.terminated = false;
      return this;
    };

    mockery.registerMock('../index.js', {
      client : function(opts) {
        return new Nightwatch(opts);
      }
    });

    done();
  },

  tearDown: function(callback) {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
    callback();
  },

  'test start with callback on success' : function(test) {
    test.expect(2);

    var ClientManager = require('../../../'+ BASE_PATH +'/runner/clientmanager.js');
    var client = new ClientManager();
    client.init({});
    client.start(function() {
      test.equals(client['@client'].terminated, false);
      test.equals(arguments.length, 0);
      test.done();
    });

    setImmediate(function() {
      client['@client'].emit('nightwatch:finished', {
        failed : 0,
        errors : 0
      });
    });

  },


  'test start with callback on failed' : function(test) {
    test.expect(1);

    var ClientManager = require('../../../'+ BASE_PATH +'/runner/clientmanager.js');
    var client = new ClientManager();
    client.init({});
    client.start(function(err) {
      test.deepEqual(err, {message : 'AssertionError'});
      test.done();
    });

    setImmediate(function() {
      client['@client'].emit('nightwatch:finished', {
        failed : 1,
        errors : 0,
        lastError : {message : 'AssertionError'}
      });
    });

  },
};