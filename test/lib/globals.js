var fs = require('fs');
var path = require('path');

module.exports = {
  runGroupGlobal : function(client, hookName, done) {
    var groupGlobal = path.join(__dirname, './globals/', client.currentTest.group.toLowerCase() + '.js');
    fs.stat(groupGlobal, function(err, stats) {
      if (err) {
        return done();
      }

      var global = require(groupGlobal);
      if (global[hookName]) {
        global[hookName].call(global, done);
      } else {
        done();
      }
    });
  },

  beforeEach: function (client, done) {
    if (client.currentTest.group) {
      this.runGroupGlobal(client, 'beforeEach', done);
    } else {
      done();
    }
  },

  afterEach : function(client, done) {
    if (client.currentTest.group) {
      this.runGroupGlobal(client, 'afterEach', done);
    } else {
      done();
    }
  }
};