const path = require('path');
const fs = require('fs');
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
}

module.exports = Screenshots;
