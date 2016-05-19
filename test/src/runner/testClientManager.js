var common = require('../../common.js');
var mockery = require('mockery');
var util = require('util');
var events = require('events');
var assert = require('assert');

module.exports = {
  'test ClientManager' : {
    beforeEach : function() {
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
    },

    afterEach: function() {
      mockery.deregisterAll();
      mockery.resetCache();
      mockery.disable();
    },

    'test start with callback on success' : function(done) {
      var ClientManager = common.require('runner/clientmanager.js');
      var client = new ClientManager();
      client.init({});
      client.start(function() {
        assert.equal(client['@client'].terminated, false);
        assert.equal(arguments.length, 0);
        done();
      });

      setImmediate(function() {
        client['@client'].emit('nightwatch:finished', {
          failed : 0,
          errors : 0
        });
      });
    },


    'test start with callback on failed' : function(done) {
      var ClientManager = common.require('runner/clientmanager.js');
      var client = new ClientManager();
      client.init({});
      client.start(function(err) {
        assert.deepEqual(err, {message : 'AssertionError'});
        done();
      });

      setImmediate(function() {
        client['@client'].emit('nightwatch:finished', {
          failed : 1,
          errors : 0,
          lastError : {message : 'AssertionError'}
        });
      });

    }
  }
};