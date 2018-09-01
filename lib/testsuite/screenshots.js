const path = require('path');
const fs = require('fs');
const mkpath = require('mkpath');
const Logger = require('../util/logger.js');

class Screenshots {
  constructor(settings) {
    this.settings = settings;
  }

  saveErrorContent(result, screenshotContent, currentTest = '') {
    // FIXME: get currentTest
    let fileNamePath = Screenshots.getScreenshotFileName(currentTest, true, this.settings.screenshots.path);
    Screenshots.writeScreenshotToFile(fileNamePath, screenshotContent, {output: true});
    result.lastScreenshotFile = fileNamePath;
  }

  static getScreenshotFileName(currentTest, isError, screenshotsPath) {
    let prefix = currentTest.module + '/' + currentTest.name;
    prefix = prefix.replace(/\s/g, '-').replace(/"|'/g, '');
    prefix += isError ? '_ERROR' : '_FAILED';

    let d = new Date();
    let dateParts = d.toString().replace(/:/g,'').split(' ');
    dateParts.shift();
    dateParts.pop();
    let dateStamp = dateParts.join('-');

    return path.resolve(path.join(screenshotsPath, `${prefix}_${dateStamp}.png`));
  }

  /**
   *
   * @param fileName
   * @param content
   * @param cb
   */
  static writeScreenshotToFile(fileName, content, cb = function() {}) {
    let dir = path.resolve(fileName, '..');
    let fail = function(err) {
      Logger.error(`Couldn't save screenshot to "${fileName}":`);
      Logger.error(err);

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

module.exports = Screenshots;