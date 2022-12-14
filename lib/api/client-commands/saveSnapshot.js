const http = require('http');
const https = require('https');
const {URL} = require('url');
const Stream = require('stream').Transform;
const {JSDOM} = require('jsdom');
const ClientCommand = require('./_base-command.js');
const {Snapshots, Logger} = require('../../utils');

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
        throw new Error('getCurrentUrl failed');
      }

      if (client.transport.isResultSuccess(results[1]) && results[1].value) {
        pageSource = results[1].value;
      } else {
        throw new Error('pageSource failed');
      }

      return this.createSnapshot(baseUrl, pageSource).then(result => {
        return {data: result, baseUrl};
      }
      );
    }).then(result => {
      const {data, baseUrl} = result;

      return Snapshots.writeSnapshotToFile(fileName, data).then((fileName => {
        return {
          fileName,
          baseUrl
        };
      }));
    }).then(result => {
      callback.call(this, result);
    }).catch(err => {
      Logger.warn(`Couldn't save snapshot to "${fileName}: ${err.message}`);
      callback.call(this, null);
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

    return Promise.all([
      this.inlineImages(document, baseUrl),
      this.inlineCss(document, baseUrl)
    ]).then(() => {
      return dom.serialize();
    });
  }

  async inlineImages(document, baseUrl) {
    const images = document.querySelectorAll('img');

    const promises = [];
    for (const imageNode of images) {
      const imageUrl = imageNode.getAttribute('src');
      if (!(imageUrl.startsWith('data:') || imageUrl.startsWith('blob:'))) {
        const promise = this.downloadUrl(imageUrl, baseUrl)
          .then((result) => {
            const {contentType, data} = result;
            imageNode.src =  `data:${contentType};base64,${data.read().toString('base64')}`;
      
            imageNode.removeAttribute('srcset');
          });

        promises.push(promise);
      }
    }

    return Promise.all(promises);
  }

  async inlineCss(document, baseUrl) {
    const links = document.querySelectorAll('link');

    const promises = [];
    for (const linkNode of links) {
      const linkUrl = linkNode.getAttribute('href');
      if (linkNode.getAttribute('rel') === 'stylesheet' || linkNode.getAttribute('href').endsWith('.css')) {
        const promise = this.downloadUrl(linkUrl, baseUrl)
          .then((result) => {
            const {data} = result;

            const styleTag = document.createElement('style');
            styleTag.type = 'text/css';
            styleTag.innerHTML = data.read().toString();

            linkNode.parentElement.append(styleTag);
            linkNode.remove();
          });
        
        promises.push(promise);
      } else if (linkNode.getAttribute('href').endsWith('.js')) {
        linkNode.remove();
      }
    }

    return Promise.all(promises);
  }

  // TODO: error handling
  async downloadUrl(url, baseUrl) {
    const normalizedUrl = new URL(url, baseUrl);
  
    return new Promise((resolve, reject) => {
      let client = http;
      if (normalizedUrl.toString().indexOf('https') === 0){
        client = https;
      }
          
      client.request(normalizedUrl, function(response) {
        const data = new Stream();    
          
        response.on('data', function(chunk) {
          data.push(chunk);         
        }); 
          
        const headers = response.headers;
        response.on('end', function() {
          resolve({
            contentType: headers['content-type'],
            data
          });
        });
      }).end();
    });
  }

  command(fileName, callback) {
    this.fileName = fileName;

    return super.command(callback);
  }
}

module.exports = SaveSnapshot;
