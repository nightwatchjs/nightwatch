const path = require('path');
const fs = require('fs');
const mkpath = require('mkpath');
const Defaults = require('../settings/defaults.js');

class Screenshots {
  /**
   * @param {object} prefix
   * @param {object} screenshots
   * @return {string}
   */
  static getFileName({testSuite, testCase, isError = false}, screenshots) {
    const dateObject = new Date();
    let filename;
    let filename_format;

    if (typeof screenshots.filename_format == 'function') {
      filename_format = screenshots.filename_format.bind(screenshots);
    } else {
      filename_format = Defaults.screenshots.filename_format;
    }

    filename = filename_format({testSuite, testCase, isError, dateObject});
    filename = filename.replace(/\s/g, '-').replace(/["']/g, '');

    return path.join(screenshots.path, filename);
  }

  /**
   *
   * @param {String} fileName
   * @param {String} content
   * @param {function} cb
   */
  static writeScreenshotToFile(fileName, content, cb = function() {}) {
    // eslint-disable-next-line no-console
    console.log('Binayak', 'inside writeScreenshotToFile', fileName, content);
    const dir = path.resolve(fileName, '..');

    // eslint-disable-next-line no-console
    console.log('Binayak', 'inside writeScreenshotToFile after path.resolve', fileName, content);
    mkpath(dir, function(err) {
      // eslint-disable-next-line no-console
      console.log('Binayak', 'inside makepath', {err});
      if (err) {
        cb(err);
      } else {
        fs.writeFile(fileName, content, 'base64', function(err) {
          // eslint-disable-next-line no-console
          console.log('Binayak', 'inside writefile', {err});
          if (err) {
            cb(err);
          } else {
            cb(null, fileName);
          }
        });
      }
    });
  }
}

module.exports = Screenshots;
