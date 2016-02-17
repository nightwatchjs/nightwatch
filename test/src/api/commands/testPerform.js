var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var Globals = require('../../../lib/globals.js');
var CommandGlobals = require('../../../lib/globals/commands.js');

module.exports = {
  perform : {
    beforeEach : function(done) {
      Globals.interceptStartFn();
      CommandGlobals.beforeEach(done);
    },
    afterEach : function(done) {
      Globals.restoreStartFn();
      CommandGlobals.afterEach(done);
    },

    'client.perform()' : function(done) {
      var api = Nightwatch.api();

      api.perform(function() {
        assert.deepEqual(api, this);
      });

      Nightwatch.start(done);
    },

    'client.perform() with async callback' : function(done) {
      var api = Nightwatch.api();

      api.perform(function(complete) {
        assert.equal(typeof complete, 'function');
        complete();
      });

      Nightwatch.start(done);
    },

    'client.perform() with async callback and api param' : function(done) {
      var api = Nightwatch.api();

      api.perform(function(client, complete) {
        assert.deepEqual(api, client);
        assert.equal(typeof complete, 'function');
        complete();
      });

      Nightwatch.start(done);
    }
  }
};