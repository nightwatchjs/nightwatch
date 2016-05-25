var fs = require('fs');
var path = require('path');
var common = require('../common.js');
var ClientManager = common.require('runner/clientmanager.js');
var _originalStartFn = ClientManager.prototype.start;

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

  interceptStartFn : function() {
    ClientManager.prototype.start = function() {};
  },

  restoreStartFn : function() {
    ClientManager.prototype.start = _originalStartFn;
  },

  beforeEach: function (client, done) {
    this.interceptStartFn();

    if (client.currentTest.group) {
      this.runGroupGlobal(client, 'beforeEach', done);
    } else {
      done();
    }
  },

  afterEach : function(client, done) {
    this.restoreStartFn();

    if (client.currentTest.group) {
      this.runGroupGlobal(client, 'afterEach', done);
    } else {
      done();
    }
  }
};