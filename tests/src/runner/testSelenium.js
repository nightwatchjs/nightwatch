
var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var selenium = require('../../../' + BASE_PATH +'/runner/selenium.js');
var mockSpawn = require('mock-spawn');

module.exports = {
  setUp: function (callback) {
    this.mockedSpawn = mockSpawn();
    this.origPrint = require('util').print;
    this.origSpawn = require('child_process').spawn;

    require('child_process').spawn = this.mockedSpawn;
    require('util').print = function() {};

    callback();
  },

  testStartServerDisabled : function(test) {
    selenium.startServer({}, function() {
      test.ok('Callback called');
    });

    selenium.startServer({
      selenium : {
        start_process : false
      }
    }, function() {
      test.ok('Callback called');
      test.done();
    });
  },

  testStartServer : function(test) {
    this.mockedSpawn.setStrategy(function (command, args, opts) {
      if (command !== 'java') {
        return null;
      }
      return function (cb) {
        this.stdout.write('Started org.openqa.jetty.jetty.Server');
        return cb(0); // and exit 0
      };
    });

    selenium.startServer({
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
      test.ok('Callback called');
      test.equals(process.command, 'java');
      test.deepEqual(process.args, ['-jar', './selenium.jar', '-port', 4444, '-host', '127.0.0.1', '-Dwebdriver.test.property=test', '-DpropName=1']);
      test.equals(process.host, '127.0.0.1');
      test.equals(process.port, 4444);
      test.equals(error, null);
      test.done();
    });
  },

  testStartServerWithOtherHost : function(test) {
    this.mockedSpawn.setStrategy(function (command, args, opts) {
      if (command !== 'java') {
        return null;
      }
      return function (cb) {
        this.stdout.write('Started org.openqa.jetty.jetty.Server');
        return cb(0); // and exit 0
      };
    });

    selenium.startServer({
      selenium : {
        start_process : true,
        server_path : './selenium.jar',
        log_path : false,
        host: '192.168.0.2',
        port: 1024
      }
    }, function(error, process) {
      test.deepEqual(process.args, ['-jar', './selenium.jar', '-port', 1024, '-host', '192.168.0.2']);
      test.equals(process.host, '192.168.0.2');
      test.equals(process.port, 1024);
      test.done();
    });
  },

  testStartServerWithExitCode : function(test) {
    selenium.startServer({
      selenium : {
        start_process : true,
        server_path : './selenium.jar',
        log_path : false,
        host: '192.168.0.2',
        port: 1024
      }
    }, function(msg, child, data, code) {
      test.equals(msg, 'Could not start Selenium.');
      test.done();
    });
  },

  tearDown : function(callback) {
    // clean up

    require('child_process').spawn = this.origSpawn;
    require('util').print = this.origPrint;

    callback();
  }
};
