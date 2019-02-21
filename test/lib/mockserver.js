const http = require('http');
const jsYaml = require('js-yaml');
const fs   = require('fs');
const path   = require('path');
const defaultsDeep = require('lodash.defaultsdeep');

class MockServer {

  static get defaultOptions() {
    return {
      postdata: '',
      weakURLVerification: false,
      responseHeaders: {},
      responseType: 'application/json',
      mocks: [],
      finishedCallback() {}
    };
  }

  get options() {
    return this.__options;
  }

  get mocks() {
    return this.__mocks;
  }

  constructor(opts = {}, callback = function () {}) {
    this.__options = opts;
    defaultsDeep(this.__options, MockServer.defaultOptions);
    this.__mocks = this.options.mocks;
    this.cb = callback;

    this.createServer();
  }

  listen() {
    this.server.listen(this.options.port, this.cb);

    return this.server;
  }

  createServer() {
    this.server = http.createServer((req, res) => {
      let postdata = '';
      let headers;
      req.setEncoding('utf8');
      req.on('data', function(chunk) {
        postdata += chunk;
      });

      req.on('end', () => {
        let item = this.nextInLine(req, postdata);
        let responsedata = '';

        if (item) {
          headers = item.responseHeaders;
          responsedata = JSON.stringify(item.response);
          headers['Content-Type']   = this.options.responseType;
          headers['Content-Length'] = responsedata.length;
          res.writeHead(Number(item.statusCode), headers);

          if (item.__once) {
            this.removeMock(item);
          }
        } else {
          headers = {};
          headers['Content-Type'] = 'text/plain';
          headers['Content-Length'] = 0;
          res.writeHead(404, 'Not Found', headers);
        }

        this.options.finishedCallback(req, res);

        if (item && item.socketDelay) {
          const timeoutId = setTimeout(function() {
            res.end(responsedata);
          }, item.socketDelay);

          req.on('close', function(err) {
            clearTimeout(timeoutId);
          });

          return;
        }

        res.end(responsedata);
      });
    });
  }

  /**
   * @param {} item
   * @param {boolean} once
   */
  addMock(item, once = false) {
    if (once) {
      item.__once = true;
    }

    if (item.response && typeof item.response == 'string') {
      item.response = JSON.parse(item.response);
    }
    this.mocks.push(item);
  }

  removeMock(mock) {
    const normalizedPostData = mock.postdata && normalizeJSONString(mock.postdata);
    const mockMethod = mock.method || 'get';

    for (let i = 0; i < this.mocks.length; i++) {
      let item = this.mocks[i];

      if (
        item.url === mock.url && item.method.toLowerCase() === mockMethod.toLowerCase() &&
        (!mock.postdata || isPostDataEqual(item.postdata, normalizedPostData))
      ) {
        this.mocks.splice(i, 1);
        break;
      }
    }
  }

  nextInLine(req, postdata) {
    const data = postdata ? normalizeJSONString(postdata) : null;

    for (let i = 0; i < this.mocks.length; i++) {
      let item = this.mocks[i];

      item.postdata = item.postdata || '';
      item.method = item.method || 'POST';
      item.statusCode = item.statusCode || 200;

      if (item.url === req.url && item.method.toLowerCase() === req.method.toLowerCase()) {
        item.responseHeaders = item.responseHeaders || {};
        item.response = item.response || '';

        if (!item.postdata) {
          return item;
        }

        if (data && isPostDataEqual(item.postdata, data)) {
          return item;
        }

        if (!data) {
          return item;
        }
      }
    }

    return null;
  }

}

const isPostDataEqual = (notNormalizedData, normalizedData) => {
  let normalized;

  if (typeof notNormalizedData == 'string') {
    normalized = normalizeJSONString(notNormalizedData);
  } else if (typeof notNormalizedData == 'object') {
    normalized = JSON.stringify(notNormalizedData);
  }

  return normalizedData === normalized;
};

const normalizeJSONString = (data) => {
  try {
    if (typeof data == 'string') {
      return JSON.stringify(JSON.parse(data));
    }

    return JSON.stringify(data);
  } catch (err) {
    console.error('Unabled to parse: "', data, '"');
    console.error(err);
  }
};

let server;

module.exports = {
  init(callback = function() {}) {
    Object.keys(require.cache).forEach(function(module) {
      if (module.indexOf('/mocks.json') > -1) {
        delete require.cache[module];
      }
    });

    const mockObjectsJsonWire = jsYaml.safeLoad(
      fs.readFileSync(path.join(__dirname, './mocks/mocks-jsonwire.yaml'), 'utf8')
    );
    const mockObjectsW3C = jsYaml.safeLoad(
      fs.readFileSync(path.join(__dirname, './mocks/mocks-w3c.yaml'), 'utf8')
    );

    server = new MockServer({
      port: 10195,
      mocks: mockObjectsJsonWire.mocks.concat(mockObjectsW3C.mocks)
    }, callback);

    try {
      return server.listen();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  },

  /**
   *
   * @param {Object} item
   * @param {boolean} once
   */
  addMock(item, once) {
    return server.addMock(item, once);
  },

  /**
   *
   * @param {Object} mock
   */
  removeMock(mock) {
    return server.removeMock(mock);
  }
};
