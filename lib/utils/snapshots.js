const path = require('path');
const fs = require('fs');
const mkpath = require('mkpath');
const Defaults = require('../settings/defaults.js');

class Snapshots {
  /**
   * @param {object} prefix
   * @param {object} snapshots
   * @return {string}
   */
  static getFileName({testSuite, testCase, commandName, trace_settings = Defaults.trace, output_folder = ''}) {
    const dateObject = new Date();
    let filename_format;
    let filename;

    if (typeof trace_settings.filename_format == 'function') {
      filename_format = trace_settings.filename_format.bind(trace_settings);
    } else {
      filename_format = Defaults.snapshots.filename_format;
    }

    const base_path = trace_settings.path || `${output_folder}/snapshots`;

    filename = filename_format({testSuite, testCase, commandName, dateObject});
    filename = filename.replace(/\s/g, '-').replace(/["']/g, '');

    return path.join(base_path, filename);
  }

  /**
   *
   * @param {String} fileName
   * @param {String} content
   * @param {function} cb
   */
  static async writeSnapshotToFile(fileName, content) {
    const dir = path.resolve(fileName, '..');

    return new Promise((resolve, reject) => {
      mkpath(dir, function(err) {
        if (err) {
          reject(err);
        } else {
          fs.writeFile(fileName, content, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve(fileName);
            }
          });
        }
      });
    });

  }
}

module.exports = Snapshots;
