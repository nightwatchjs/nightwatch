const http = require('http');
const https = require('https');
const {URL} = require('url');
const Stream = require('stream').Transform;
const cheerio = require('cheerio');
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

      return this.createSnapshot(baseUrl, pageSource);
    }).then(result => {
      return Snapshots.writeSnapshotToFile(fileName, result);
    }).then(result => {
      callback.call(this, result);
    }).catch(err => {
      Logger.warn(`Couldn't save snapshot to "${fileName}: ${err.message}`);
      callback.call(this, null);
    });
  }

  async createSnapshot(baseUrl, pageSource) {
    const $ = cheerio.load(pageSource);
    // Remove all script tags
    $('script').remove();

    return Promise.all([
      this.inlineImages($, baseUrl),
      this.inlineCss($, baseUrl)
    ]).then(() => {
      return $.html();
    });
  }

  async inlineImages($, baseUrl) {
    const images = $('img');

    const promises = [];
    for (const image of images) {
      const imageNode = $(image);
      const imageUrl = imageNode.attr('src');
      if (!(imageUrl.startsWith('data:') || imageUrl.startsWith('blob:'))) {
        const promise = this.downloadUrl(imageUrl, baseUrl)
          .then((result) => {
            const {contentType, data} = result;
            imageNode.attr('src', `data:${contentType};base64,${data.read().toString('base64')}`);
      
            // TODO: check if this is correct
            imageNode.removeAttr('srcset');
          });

        promises.push(promise);
      }
    }

    return Promise.all(promises);
  }

  async inlineCss($, baseUrl) {
    const links = $('link');

    const promises = [];
    for (const link of links) {
      const linkNode = $(link);
      const linkUrl = linkNode.attr('href');
      if (linkNode.attr('rel') === 'stylesheet' || linkNode.attr('href').endsWith('.css')) {
        const promise = this.downloadUrl(linkUrl, baseUrl)
          .then((result) => {
            const {data} = result;

            linkNode.parent().append(`
                <style>
                ${data.read().toString()}
                </style>
            `);
            linkNode.remove();
          });
        
        promises.push(promise);
      } else if (linkNode.attr('href').endsWith('.js')) {
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
