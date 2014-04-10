var BASE_PATH = process.env.NIGHTWATCH_COV
  ? 'lib-cov'
  : 'lib';
var selenium = require('../../../' + BASE_PATH +'/runner/selenium.js');
var child_process = require('child_process');

module.exports = {
  setUp: function (callback) {
    callback();
  },

  testStartServerDisabled : function(test) {
    selenium.startServer({
    }, {}, function() {
      test.ok('Callback called');
    });

    selenium.startServer({
      selenium : {
        start_process : false
      }
    }, {}, function() {
      test.ok('Callback called');
      test.done();
    });
  },

  tearDown : function(callback) {
    // clean up
    callback();
  }
};
