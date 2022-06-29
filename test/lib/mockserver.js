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
      contentType: 'application/json',
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
          headers['Content-Type']   = item.contentType || this.options.contentType;
          headers['Content-Length'] = responsedata.length;
          res.writeHead(Number(item.statusCode), headers);

          if (item.onRequest) {
            item.onRequest(item);
          }

          if (item.onResponse) {
            item.onResponse();
          }

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
    let {times = 0} = item;

    if (once || times >= 1) {
      item.__once = true;
    }

    if (!times) {
      times = 1;
    }

    // if (item.response && typeof item.response == 'string') {
    //   item.response = JSON.parse(item.response);
    // }

    if (item.response && typeof item.response == 'string') {
      item.contentType = item.contentType || 'application/json';

      if (item.contentType === 'application/json') {
        try {
          item.response = JSON.parse(item.response);
        } catch (err) {
          console.warn('Invalid json supplied as response:', item.response);
        }
      }
    }

    for (let i = 0; i < times; i++) {
      this.mocks.push(item);
    }

  }

  removeMock(mock) {
    const normalizedPostData = mock.postdata && normalizeJSONString(mock.postdata);
    const mockMethod = mock.method || 'get';

    for (let i = 0; i < this.mocks.length; i++) {
      let item = this.mocks[i];

      if (
        item.url === mock.url && item.method.toLowerCase() === mockMethod.toLowerCase() &&
        (!mock.postdata || isPostDataEqual(item.postdata, normalizedPostData, item.matchEmpty))
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

        if (data && isPostDataEqual(item.postdata, data, item.matchEmpty)) {
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

const isPostDataEqual = (notNormalizedData, normalizedData, matchEmpty = false) => {
  let normalized;

  if (typeof notNormalizedData == 'string') {
    normalized = normalizeJSONString(notNormalizedData);
  } else if (typeof notNormalizedData == 'object') {
    normalized = JSON.stringify(notNormalizedData);
  }

  const postDataEquals = normalizedData === normalized;
  if (matchEmpty && !postDataEquals) {
    const incomingPostData = JSON.parse(normalized);
    const matchData = JSON.parse(normalizedData);

    return objectIncludes(matchData, incomingPostData);
  }

  return postDataEquals;
};

const objectIncludes = (target, source) => {
  return Object.keys(target).every(function(key) {
    if (!(key in source)) {
      return false;
    }

    if (source[key] && typeof source[key] == 'object') {
      return objectIncludes(target[key], source[key]);
    }

    return (target[key] === source[key] || source[key] === '');
  });
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
  init(callback = function() {}, {port = 10195} = {}) {
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

    const mocks = mockObjectsJsonWire.mocks.concat(mockObjectsW3C.mocks);

    server = new MockServer({
      port,
      mocks
    }, callback);

    try {
      return server.listen();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  },

  initAsync({port, mocks = []} = {}) {
    return new Promise(function(resolve, reject) {
      server = new MockServer({
        port,
        mocks
      }, function() {});
      const httpServer = server.listen();
      httpServer.on('listening', function () {
        resolve(server);
      });
    });
  },

  /**
   *
   * @param {Object} item
   * @param {boolean} once
   */
  addMock(item, once, twice) {
    if (!server) {
      throw new Error('Server is not yet created');
    }
    server.addMock(item, once);
    if (twice) {
      server.addMock(item, once);
    }

    return this;
  },

  /**
   *
   * @param {Object} mock
   */
  removeMock(mock) {
    return server.removeMock(mock);
  }
};
