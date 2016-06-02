var Globals = require('./globals.js');
var CommandGlobals = require('./globals/commands.js');

module.exports = {
  addBefore : function(done) {
    Globals.interceptStartFn();
    CommandGlobals.beforeEach.call(this, done);
  },

  addAfter : function(done) {
    CommandGlobals.afterEach.call(this, function() {
      Globals.restoreStartFn();
      done();
    });
  },

  add : function(key, body) {
    var result = {};

    result[key] = body;

    result[key].before = this.addBefore;
    result[key].after = this.addAfter;

    return result;
  }
};
