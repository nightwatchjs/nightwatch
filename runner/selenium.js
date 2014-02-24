/**
 * Module dependencies
 */
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var util = require('util');
var Logger = require('../lib/logger.js');

module.exports = new (function() {
  var SENTINAL = 'Started org.openqa.jetty.jetty.Server';
  var DEFAULT_HOST = '127.0.0.1';
  var DEFAULT_PORT = 4444;
  var seleniumProcess = null;
  
  this.startServer = function (settings, test_settings, callback) {
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
    
    util.print(Logger.colors.light_purple('Starting selenium server... '));
    
    if (test_settings.firefox_profile) {
      cliOpts.push('-Dwebdriver.firefox.profile=' + test_settings.firefox_profile);    
    }
    if (test_settings.chrome_driver) {
      cliOpts.push('-Dwebdriver.chrome.driver=' + test_settings.chrome_driver);
    }
    if (test_settings.ie_driver) {
      cliOpts.push('-Dwebdriver.ie.driver=' + test_settings.ie_driver);
    }
    
    seleniumProcess = spawn('java', cliOpts);
    seleniumProcess.host = selenium_host;
    seleniumProcess.port = selenium_port;

    seleniumProcess.stdout.on('data', function(data) {
      output += data.toString();
      if (data.toString().indexOf(SENTINAL) != -1) {
        seleniumProcess.removeListener('exit', exitHandler);
        util.print(Logger.colors.light_purple('started - PID: ' ) + ' ' + seleniumProcess.pid + '\n' + Logger.colors.light_green('Running tests') + '\n');
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
        fs.writeFile(path.join(settings.selenium.log_path, 'selenium_out.log'), output, 'utf8', function(err) {
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
