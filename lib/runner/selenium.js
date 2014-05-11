/**
 * Module dependencies
 */
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var util = require('util');
var Logger = require('../util/logger.js');

module.exports = new (function() {
  var SENTINEL = 'Started org.openqa.jetty.jetty.Server';
  var DEFAULT_HOST = '127.0.0.1';
  var DEFAULT_PORT = 4444;
  var DEFAULT_LOG_FILE = 'selenium-debug.log';
  var seleniumProcess = null;

  this.startServer = function (settings, callback) {
    if (!settings.selenium || !settings.selenium.start_process || !settings.selenium.server_path) {
      callback();
      return;
    }

    var selenium_port = settings.selenium.port || DEFAULT_PORT;
    var selenium_host = settings.selenium.host || DEFAULT_HOST;
    var output = '';
    var error_out = '';
    var spawn = child_process.spawn;
    var cliOpts = [
      '-jar', settings.selenium.server_path,
      '-port', selenium_port,
      '-host', selenium_host
    ];

    util.print(Logger.colors.light_purple('Starting selenium server' + (settings.parallelMode ? ' in parallel mode' : '') +'... '));

    if (typeof settings.selenium.cli_args == 'object') {
      var cli_args = settings.selenium.cli_args;
      for (var keyName in cli_args) {
        if (cli_args[keyName]) {
          var property = '';
          if (keyName.indexOf('-D') !== 0) {
            property += '-D';
          }
          property += keyName + '=' + cli_args[keyName];
          cliOpts.push(property);
        }
      }
    }

    seleniumProcess = spawn('java', cliOpts);
    seleniumProcess.host = selenium_host;
    seleniumProcess.port = selenium_port;
    seleniumProcess.on('error', function(err) {
      if (err.code == 'ENOENT') {
        console.log(Logger.colors.red('\nAn error occured while trying to start Selenium. ' +
          'Check if JAVA is installed on your machine.'));
        console.log(util.inspect(err, false, 1, true));
      }
    });

    seleniumProcess.stdout.on('data', function(data) {
      output += data.toString();
      if (data.toString().indexOf(SENTINEL) != -1) {
        seleniumProcess.removeListener('exit', exitHandler);
        util.print(Logger.colors.light_purple('started - PID: ' ) + ' ' +
          seleniumProcess.pid + '\n' + (settings.parallelMode ? '\n' : ''));
        callback(null, seleniumProcess);
      }
    });

    seleniumProcess.stderr.on('data', function(data) {
      output += data.toString();
      error_out += data.toString();
    });

    var exitHandler = function(code) {
      callback('Could not start Selenium.', null, error_out, code);
    };

    var closeHandler = function() {
      if (typeof settings.selenium.log_path == 'undefined') {
        settings.selenium.log_path = '';
      }

      if (settings.selenium.log_path !== false) {
        fs.writeFile(path.join(settings.selenium.log_path, DEFAULT_LOG_FILE), output, 'utf8', function(err) {
          if (err) {
            console.log(Logger.colors.light_red('\nError writing log file to:'), err.path);
          }
        });
      }
      Logger.info('Selenium process finished.');
    };

    seleniumProcess.on('exit', exitHandler);
    seleniumProcess.on('close', closeHandler);
  };

  this.stopServer = function (callback) {
    callback = callback || function() {};
    if (!seleniumProcess || seleniumProcess.killed) {
      Logger.warn('Selenium process is not started.');
      callback(false);
      return;
    }
    try {
      seleniumProcess.kill();
      callback(true);
    } catch (e) {
      Logger.warn('Selenium process could not be stopped.');
      console.log(e);
      callback(false);
    }
  };
})();
