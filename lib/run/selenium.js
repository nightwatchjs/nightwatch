/**
 * Module dependencies
 */
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var util = require('util');
var Logger = require('../util/logger.js');

var SENTINEL = 'Started org.openqa.jetty.jetty.Server';
var DEFAULT_HOST = '127.0.0.1';
var DEFAULT_PORT = 4444;
var DEFAULT_LOG_FILE = 'selenium-debug.log';

function SeleniumServer(settings, callback) {
  this.settings = settings;
  this.onStarted = callback;

  this.port = this.settings.selenium.port || DEFAULT_PORT;
  this.host = this.settings.selenium.host || DEFAULT_HOST;
  this.output = '';
  this.error_out = '';
  this.process = null;
}

SeleniumServer.prototype.setCliArgs = function() {
  this.cliOpts = [
    '-jar', this.settings.selenium.server_path,
    '-port', this.port,
    '-host', this.host
  ];
  if (typeof this.settings.selenium.cli_args == 'object') {
    var cli_args = this.settings.selenium.cli_args;
    for (var keyName in cli_args) {
      if (cli_args[keyName]) {
        var property = '';
        if (keyName.indexOf('-D') !== 0) {
          property += '-D';
        }
        property += keyName + '=' + cli_args[keyName];
        this.cliOpts.push(property);
      }
    }
  }
};

SeleniumServer.prototype.start = function() {
  util.print(Logger.colors.light_purple('Starting selenium server' + (this.settings.parallelMode ? ' in parallel mode' : '') +'... '));
  this.setCliArgs();
  this.process = child_process.spawn('java', this.cliOpts);
  this.process.host = this.host;
  this.process.port = this.port;
  this.exitHandlerFn = this.exitHandler.bind(this);

  this.process.on('error', this.onError.bind(this));
  this.process.on('exit', this.exitHandlerFn);
  this.process.on('close', this.closeHandler.bind(this));

  this.process.stdout.on('data', this.onStdoutData.bind(this));
  this.process.stderr.on('data', this.onStderrData.bind(this));
};

SeleniumServer.prototype.stop = function(callback) {
  if (!this.process || this.process.killed) {
    Logger.warn('Selenium process is not started.');
    callback(false);
    return;
  }
  try {
    this.process.kill();
    callback(true);
  } catch (e) {
    Logger.warn('Selenium process could not be stopped.');
    console.log(e);
    callback(false);
  }
};

SeleniumServer.prototype.exitHandler = function (code) {
  this.onStarted('Could not start Selenium.', null, this.error_out, code);
};

SeleniumServer.prototype.closeHandler = function() {
  if (typeof this.settings.selenium.log_path == 'undefined') {
    this.settings.selenium.log_path = '';
  }

  if (this.settings.selenium.log_path !== false) {
    fs.writeFile(path.join(this.settings.selenium.log_path, DEFAULT_LOG_FILE), this.output, 'utf8', function(err) {
      if (err) {
        console.log(Logger.colors.light_red('\nError writing log file to:'), err.path);
      }
    });
  }
  Logger.info('Selenium process finished.');
};

SeleniumServer.prototype.onError = function(err) {
  if (err.code == 'ENOENT') {
    console.log(Logger.colors.red('\nAn error occurred while trying to start Selenium. ' +
      'Check if JAVA is installed on your machine.'));
    console.log(util.inspect(err, false, 1, true));
  }
};

SeleniumServer.prototype.onStderrData = function(data) {
  this.error_out += data.toString();
  this.checkProcessStarted(data);
};

SeleniumServer.prototype.onStdoutData = function(data) {
  this.checkProcessStarted(data);
};

SeleniumServer.prototype.checkProcessStarted = function(data) {
  var output = data.toString();
  this.output += output;
  if (output.indexOf(SENTINEL) != -1) {
    var exitHandler = this.exitHandlerFn;

    this.process.removeListener('exit', exitHandler);
    util.print(Logger.colors.light_purple('started - PID: ' ) + ' ' +
    this.process.pid + '\n' + (this.settings.parallelMode ? '\n' : ''));
    this.onStarted(null, this.process);
  }
};

module.exports = new (function() {
  var server;

  this.startServer = function (settings, callback) {
    if (!settings.selenium || !settings.selenium.start_process || !settings.selenium.server_path) {
      callback();
      return;
    }

    server = new SeleniumServer(settings, callback);
    server.start();
  };

  this.stopServer = function (callback) {
    callback = callback || function() {};

    if (!server) {
      console.log('Selenium server is not running.');
      callback(false);
      return;
    }

    server.stop(callback);
  };
})();
