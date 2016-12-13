var http = require('http');
var mocks = null;

/**
 * @param options
 * @param callback
 */
function MockServer(options, callback) {
  // The default options:
  var defaultOptions = {
    postdata: '',
    weakURLVerification: false,
    responseHeaders: {},
    responseType: 'application/json'
  };

  callback = callback || function() {};

  for (var k in defaultOptions) {
    options[k] = (options[k] || defaultOptions[k]);
  }

  if (Array.isArray(options.mocks)) {
    mocks = options.mocks;
  }
  // Prepare the next request:
  function nextInLine(req, postdata) {
    var item;
    var generic = null;

    for (var i = 0; i < mocks.length; i++) {
      item = mocks[i];

      item.postdata = item.postdata || '';
      item.method = item.method || 'POST';
      item.statusCode = item.statusCode || 200;

      if (item.url == req.url && item.method == req.method) {
        item.responseHeaders = item.responseHeaders || {};
        item.response = item.response || '';

        if (item.postdata == postdata) {
          return item;
        }

        if (!item.postdata) {
          generic = item;
        }
      }
    }

    return generic;
  }

  var s = http.createServer(function(req, res) {
    var postdata = '';
    var headers;
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
      postdata += chunk;
    });

    req.on('end', function() {
      var item = nextInLine(req, postdata);
      var responsedata = '';

      if (item) {
        headers = item.responseHeaders;
        headers['Content-Type']   = options.responseType;
        headers['Content-Length'] = item.response.length;
        res.writeHead(Number(item.statusCode), headers);
        responsedata = item.response;
      } else {
        headers = {};
        headers['Content-Type'] = 'text/plain';
        headers['Content-Length'] = 0;
        res.writeHead(404, 'Not Found', headers);
      }

      if (typeof options.finishedCallback == 'function') {
        options.finishedCallback(req, res);
      }

      if (item && item.__once) {
        removeMock(item);
      }

      if (item && item.socketDelay) {
        var timeoutId = setTimeout(function() {
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

  s.listen(options.port, callback);

  return s;
}

function removeMock(mock) {
  var item;

  for (var i = 0; i < mocks.length; i++) {
    item = mocks[i];

    if ((item.url == mock.url) && (item.method == mock.method) && (!mock.postdata || item.postdata == mock.postdata)) {
      break;
    }
  }

  if (i > 0) {
    mocks.splice(i, 1);
  }
}

module.exports = {
  init : function(callback) {
    Object.keys(require.cache).forEach(function(module) {
      if (module.indexOf('/mocks.json') > -1) {
        delete require.cache[module];
      }
    });

    var mockoptions = require('./mocks.json');
    try {
      var i = new MockServer(mockoptions, callback);
    } catch (err) {
      console.log(err);
    }
    return i;
  },

  addMock : function(item, once) {
    if (once) {
      item.__once = true;
    }
    mocks.push(item);

    return this;
  },

  removeMock : removeMock
};
