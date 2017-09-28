const Selenium = require('./selenium.js');

class Transport {
  constructor(opts = {}) {
    this.transport = new Selenium(opts);
  }

  createSession() {
    return this.transport.createSession();
  }

  runProtocolAction(requestOptions, callback) {
    var self = this;

    var request = new HttpRequest(requestOptions)
      .on('result', function(result) {
        if (typeof callback != 'function') {
          var error = new Error('Callback parameter is not a function - ' + typeof(callback) + ' passed: "' + callback + '"');
          self.errors.push(error.stack);
          self.results.errors++;
        } else {
          callback.call(self.api, result);
        }

        if (result.lastScreenshotFile && self.results.tests.length > 0) {
          var lastTest = self.results.tests[self.results.tests.length-1];
          lastTest.screenshots = lastTest.screenshots || [];
          lastTest.screenshots.push(result.lastScreenshotFile);
          delete result.lastScreenshotFile;
        }

        request.emit('complete');
      })
      .on('success', function(result, response) {
        if (result.status && result.status !== 0) {
          result = self.handleTestError(result);
        }
        request.emit('result', result, response);
      })
      .on('error', function(result, response, screenshotContent) {
        result = self.handleTestError(result);

        if (screenshotContent && self.options.screenshots.on_error) {
          var fileNamePath = Utils.getScreenshotFileName(self.api.currentTest, true, self.options.screenshots.path);
          self.saveScreenshotToFile(fileNamePath, screenshotContent);
          result.lastScreenshotFile = fileNamePath;
        }

        request.emit('result', result, response);
      });

    return request;
  }

  saveScreenshotToFile(fileName, content, cb) {
    var mkpath = require('mkpath');
    var fs = require('fs');
    var self = this;
    cb = cb || function() {};

    var dir = path.resolve(fileName, '..');
    var fail = function(err) {
      if (self.options.output) {
        console.log(Logger.colors.yellow('Couldn\'t save screenshot to '), fileName);
      }

      Logger.warn(err);
      cb(err);
    };

    mkpath(dir, function(err) {
      if (err) {
        fail(err);
      } else {
        fs.writeFile(fileName, content, 'base64', function(err) {
          if (err) {
            fail(err);
          } else {
            cb(null, fileName);
          }
        });
      }
    });
  }

}