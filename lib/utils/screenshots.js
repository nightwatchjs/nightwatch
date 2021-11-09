const path = require('path');
const fs = require('fs').promises;
const Logger = require('./logger');
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
  static async writeScreenshotToFile(fileName, content) {
    const dir = path.resolve(fileName, '..');

    try {
      await fs.mkdir(dir, {recursive: true});
      await fs.writeFile(fileName, content, 'base64');

      return fileName;
    } catch (error) {
      Logger.error(`Couldn't save screenshot to "${fileName}":`);
      Logger.error(error);
    }
  }
}

module.exports = Screenshots;
