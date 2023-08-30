const {URL} = require('url');
const {JSDOM} = require('jsdom');
const ClientCommand = require('./_base-command.js');
const {writeToFile, Logger} = require('../../utils');

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
    ])
      .then(results => {
        let baseUrl;
        let pageSource;
        if (client.transport.isResultSuccess(results[0]) && results[0].value) {
          baseUrl = new URL(results[0].value).origin;
        } else {
          throw new Error('failed to execute getCurrentUrl');
        }

        if (client.transport.isResultSuccess(results[1]) && results[1].value) {
          pageSource = results[1].value;
        } else {
          throw new Error('failed to fetch pageSource');
        }

        return this.createSnapshot(baseUrl, pageSource).then(result => {
          return {data: result, baseUrl};
        });
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
        Logger.warn(`Couldn't save snapshot to "${fileName}: ${err.message}`);
        callback.call(this, err);
      });
  }

  async createSnapshot(baseUrl, pageSource) {
    const dom = new JSDOM(pageSource);
    const document = dom.window.document;

    // Remove all script tags
    const scriptTags = document.querySelectorAll('script');
    scriptTags.forEach(element => {
      element.remove();
    });

    const headTag = document.querySelector('head');
    const baseTag = document.createElement('base');
    baseTag.setAttribute('href', baseUrl);
    headTag.prepend(baseTag);

    return dom.serialize();
  }

  command(fileName, callback) {
    this.fileName = fileName;

    return super.command(callback);
  }
}

module.exports = SaveSnapshot;
