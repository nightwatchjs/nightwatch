const path = require('path');
const Defaults = require('../settings/defaults.js');

class Snapshots {
  /**
   * @param {object} prefix
   * @param {object} snapshots
   * @return {string}
   */
  static getFileName({testSuite, testCase, commandName, traceSettings = Defaults.trace, output_folder = ''}) {
    const dateObject = new Date();
    let filename_format;
    let filename;

    if (typeof traceSettings.filename_format == 'function') {
      filename_format = traceSettings.filename_format.bind(traceSettings);
    } else {
      filename_format = Defaults.snapshots.filename_format;
    }

    const base_path = traceSettings.path || `${output_folder}/snapshots`;

    filename = filename_format({testSuite, testCase, commandName, dateObject});
    filename = filename.replace(/\s/g, '-').replace(/["']/g, '');

    return path.join(base_path, filename);
  }
}

module.exports = Snapshots;
