var assert = require('assert');
var common = require('../../common.js');
var Selenium = common.require('runner/selenium.js');
var mockSpawn = require('mock-spawn');

module.exports = {
  'test Selenium Server' : {
    beforeEach: function () {
      this.mockedSpawn = mockSpawn();
      this.origPrint = require('util').print;
      this.origSpawn = require('child_process').spawn;

      require('child_process').spawn = this.mockedSpawn;
      require('util').print = function() {};
    },

    afterEach : function() {
      // clean up

      require('child_process').spawn = this.origSpawn;
      require('util').print = this.origPrint;
    },

    testStartServerDisabled : function(done) {
      Selenium.startServer({}, function() {
        assert.ok('Callback called');
      });

      Selenium.startServer({
        selenium : {
          start_process : false
        }
      }, function() {
        assert.ok('Callback called');
        done();
      });
    },

    testStartServer : function(done) {
      this.mockedSpawn.setStrategy(function (command, args, opts) {
        assert.deepEqual(opts, {stdio : ['ignore', 'pipe', 'pipe']});
        if (command !== 'java') {
          return null;
        }
        return function (cb) {
          this.stdout.write('Started org.openqa.jetty.jetty.Server');
          return cb(0); // and exit 0
        };
      });

      Selenium.startServer({
        selenium : {
          start_process : true,
          server_path : './selenium.jar',
          log_path : false,
          cli_args : {
            'webdriver.test.property' : 'test',
            'webdriver.empty.property' : '',
            '-DpropName' : '1'
          }
        }
      }, function(error, process) {
        assert.equal(process.command, 'java');
        assert.deepEqual(process.args, ['-DpropName=1', '-Dwebdriver.test.property=test', '-jar', './selenium.jar', '-port', 4444]);
        assert.equal(process.host, undefined);
        assert.equal(process.port, 4444);
        assert.equal(error, null);
        done();
      });
    },

    testStartServerWithOtherHost : function(done) {
      this.mockedSpawn.setStrategy(function (command, args, opts) {
        if (command !== 'java') {
          return null;
        }
        return function (cb) {
          this.stdout.write('Started org.openqa.jetty.jetty.Server');
          return cb(0); // and exit 0
        };
      });

      Selenium.startServer({
        selenium : {
          start_process : true,
          server_path : './selenium.jar',
          log_path : false,
          host: '192.168.0.2',
          port: 1024
        }
      }, function(error, process) {
        assert.deepEqual(process.args, ['-jar', './selenium.jar', '-port', 1024, '-host', '192.168.0.2']);
        assert.equal(process.host, '192.168.0.2');
        assert.equal(process.port, 1024);
        done();
      });
    },

    testStartServerWithExitCode : function(done) {
      Selenium.startServer({
        selenium : {
          start_process : true,
          server_path : './selenium.jar',
          log_path : false,
          host: '192.168.0.2',
          port: 1024
        }
      }, function(msg, child, data, code) {
        assert.equal(msg, 'Could not start Selenium.');
        done();
      });
    }
  }
};
