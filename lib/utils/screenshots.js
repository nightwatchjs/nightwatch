const path = require('path');
const fs = require('fs');
const mkpath = require('mkpath');

class Screenshots {
  /**
   * @param {string} prefix
   * @param {boolean} isError
   * @param {string} screenshotsPath
   * @return {string}
   */
  static getFileName(prefix, isError, screenshotsPath) {
    let filenamePrefix = prefix
      .replace(/\s/g, '-')
      .replace(/"|'/g, '');

    filenamePrefix += isError ? '_ERROR' : '_FAILED';

    const dateParts = new Date().toString().replace(/:/g,'').split(' ');
    dateParts.shift();
    dateParts.pop();

    const dateStamp = dateParts.join('-');

    return path.resolve(path.join(screenshotsPath, `${filenamePrefix}_${dateStamp}.png`));
  }

  /**
   *
   * @param {String} fileName
   * @param {String} content
   * @param {function} cb
   */
  static writeScreenshotToFile(fileName, content, cb = function() {}) {
    const dir = path.resolve(fileName, '..');

    mkpath(dir, function(err) {
      if (err) {
        cb(err);
      } else {
        fs.writeFile(fileName, content, 'base64', function(err) {
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
