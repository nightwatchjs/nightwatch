const {URL} = require('url');
const {JSDOM} = require('jsdom');
const ClientCommand = require('./_base-command.js');
const {Logger, writeToFile} = require('../../utils');

/**
 * Take a DOM Snapshot of the current page and saves it as the given filename.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.saveSnapshot('/path/to/fileName.html');
 *  };
 *
 *
 * @method saveSnapshot
 * @param {string} fileName The complete path to the file name where the screenshot should be saved.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 */
class SaveSnapshot extends ClientCommand {
  performAction(callback) {
    const {fileName, client} = this;

    Promise.all([
      this.transportActions.getCurrentUrl(),
      this.transportActions.getPageSource()
    ]).then(results => {
      let baseUrl;
      let pageSource;
      if (client.transport.isResultSuccess(results[0]) && results[0].value) {
        baseUrl = new URL(results[0].value).origin;
      } else {
        throw new Error('failed to get getCurrentUrl');
      }

      if (client.transport.isResultSuccess(results[1]) && results[1].value) {
        pageSource = results[1].value;
      } else {
        throw new Error('failed to get pageSource');
      }

      const snapshot = this.createSnapshot(pageSource); 

      return {data: snapshot, baseUrl};
    }).then(result => {
      const {data, baseUrl} = result;

      return writeToFile(fileName, data).then((fileName => {
        return {
          snapshotFilePath: fileName,
          snapshotUrl: baseUrl
        };
      }));
    }).then(result => {
      callback.call(this, result);
    }).catch(err => {
      Logger.error(`Couldn't save snapshot to "${fileName}: ${err.message}`);
      callback.call(this, err);
    });
  }

  createSnapshot(pageSource) {
    const dom = new JSDOM(pageSource);
    const document = dom.window.document;

    // Remove all script tags
    const scriptTags = document.querySelectorAll('script');
    scriptTags.forEach(element => {
      element.remove();
    });

    return dom.serialize();
  }

  command(fileName, callback) {
    this.fileName = fileName;

    return super.command(callback);
  }
}

module.exports = SaveSnapshot;
