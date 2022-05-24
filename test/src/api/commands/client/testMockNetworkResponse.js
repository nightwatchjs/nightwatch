const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const MockServer = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');

describe('.mockNetworkResponse()', function () {
  beforeEach(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('browser.mockNetworkResponse(urlToIntercept, {status, headers, body}) with url match', function (done) {

    MockServer.addMock({
      url: '/session',
      response: {
        value: {
          sessionId: '13521-10219-202',
          capabilities: {
            browserName: 'chrome',
            browserVersion: '92.0'
          }
        }
      },
      method: 'POST',
      statusCode: 201
    }, true);

    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {}
      }
    }).then(client => {
      const expected = {
        cdpCommands: []
      };

      // Parameters of actual request made by browser
      const cdpFetchRequestPauseEvent = JSON.stringify({
        method: 'Fetch.requestPaused',
        params: {
          requestId: '123',
          request: {
            url: 'https://www.google.com/'
          }
        }
      });

      client.transport.driver.createCDPConnection = function() {
        return Promise.resolve({
          _wsConnection: {
            on: (event, callback) => {
              expected['wsEvent'] = event;
              callback(cdpFetchRequestPauseEvent);
            }
          },
          execute: function(command, params) {
            expected.cdpCommands.push(command);
            if (command === 'Fetch.fulfillRequest') {
              expected['requestId'] = params.requestId;
              expected['responseCode'] = params.responseCode;
              expected['responseHeaders'] = params.responseHeaders;
              expected['responseBody'] = params.body;
            }
          }
        });
      };

      const response = {
        status: 200,
        headers: {'Content-Type': 'UTF-8'},
        body: 'Hey there!'
      };
      client.api.mockNetworkResponse('https://www.google.com/', response, function () {
        // Assert final response with response passed
        assert.strictEqual(expected.responseCode, response.status);
        assert.deepEqual(expected.responseHeaders, [{name: 'Content-Type', value: 'UTF-8'}]);
        assert.strictEqual(expected.responseBody, Buffer.from(response.body, 'utf-8').toString('base64'));

        assert.strictEqual(expected.requestId, JSON.parse(cdpFetchRequestPauseEvent).params.requestId);
        assert.strictEqual(expected.wsEvent, 'message');
        assert.deepEqual(expected.cdpCommands, ['Fetch.fulfillRequest', 'Fetch.enable', 'Network.setCacheDisabled']);
      });
  
      client.start(done);
    });
  });

  it('browser.mockNetworkResponse(urlToIntercept, {status, headers, body}) with url un-match', function (done) {

    MockServer.addMock({
      url: '/session',
      response: {
        value: {
          sessionId: '13521-10219-202',
          capabilities: {
            browserName: 'chrome',
            browserVersion: '92.0'
          }
        }
      },
      method: 'POST',
      statusCode: 201
    }, true);

    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {}
      }
    }).then(client => {
      const expected = {
        cdpCommands: []
      };

      // Parameters of actual request made by browser
      const cdpFetchRequestPauseEvent = JSON.stringify({
        method: 'Fetch.requestPaused',
        params: {
          requestId: '123',
          request: {
            url: 'https://www.google.com/'
          }
        }
      });

      client.transport.driver.createCDPConnection = function() {
        return Promise.resolve({
          _wsConnection: {
            on: (event, callback) => {
              expected['wsEvent'] = event;
              callback(cdpFetchRequestPauseEvent);
            }
          },
          execute: function(command, params) {
            expected.cdpCommands.push(command);
            if (command === 'Fetch.continueRequest') {
              expected['requestId'] = params.requestId;
            }
          }
        });
      };

      const response = {
        status: 200,
        headers: {'Content-Type': 'UTF-8'},
        body: 'Hey there!'
      };
      client.api.mockNetworkResponse('https://www.yahoo.com/', response, function () {
        // Request will not be intercepted, Fetch.continueRequest is called instead of Fetch.fulfillRequest
        assert.strictEqual(expected.requestId, JSON.parse(cdpFetchRequestPauseEvent).params.requestId);
        assert.strictEqual(expected.wsEvent, 'message');
        assert.deepEqual(expected.cdpCommands, ['Fetch.continueRequest', 'Fetch.enable', 'Network.setCacheDisabled']);
      });
  
      client.start(done);
    });
  });

  it('browser.mockNetworkResponse(urlToIntercept, {})', function (done) {

    MockServer.addMock({
      url: '/session',
      response: {
        value: {
          sessionId: '13521-10219-202',
          capabilities: {
            browserName: 'chrome',
            browserVersion: '92.0'
          }
        }
      },
      method: 'POST',
      statusCode: 201
    }, true);

    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {}
      }
    }).then(client => {
      const expected = {
        cdpCommands: []
      };

      // Parameters of actual request made by browser
      const cdpFetchRequestPauseEvent = JSON.stringify({
        method: 'Fetch.requestPaused',
        params: {
          requestId: '123',
          request: {
            url: 'https://www.google.com/'
          }
        }
      });

      client.transport.driver.createCDPConnection = function() {
        return Promise.resolve({
          _wsConnection: {
            on: (event, callback) => {
              expected['wsEvent'] = event;
              callback(cdpFetchRequestPauseEvent);
            }
          },
          execute: function(command, params) {
            expected.cdpCommands.push(command);
            if (command === 'Fetch.fulfillRequest') {
              expected['requestId'] = params.requestId;
              expected['responseCode'] = params.responseCode;
              expected['responseHeaders'] = params.responseHeaders;
              expected['responseBody'] = params.body;
            }
          }
        });
      };

      const response = {};
      client.api.mockNetworkResponse('https://www.google.com/', response, function () {
        // Assert final response with response passed
        assert.strictEqual(expected.responseCode, 200);
        assert.deepEqual(expected.responseHeaders, []);
        assert.strictEqual(expected.responseBody, '');

        assert.strictEqual(expected.requestId, JSON.parse(cdpFetchRequestPauseEvent).params.requestId);
        assert.strictEqual(expected.wsEvent, 'message');
        assert.deepEqual(expected.cdpCommands, ['Fetch.fulfillRequest', 'Fetch.enable', 'Network.setCacheDisabled']);
      });
  
      client.start(done);
    });
  });

  it('browser.mockNetworkResponse()', function (done) {

    MockServer.addMock({
      url: '/session',
      response: {
        value: {
          sessionId: '13521-10219-202',
          capabilities: {
            browserName: 'chrome',
            browserVersion: '92.0'
          }
        }
      },
      method: 'POST',
      statusCode: 201
    }, true);

    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {}
      }
    }).then(client => {
      const expected = {
        cdpCommands: []
      };

      // Parameters of actual request made by browser
      const cdpFetchRequestPauseEvent = JSON.stringify({
        method: 'Fetch.requestPaused',
        params: {
          requestId: '123',
          request: {
            url: ''
          }
        }
      });

      client.transport.driver.createCDPConnection = function() {
        return Promise.resolve({
          _wsConnection: {
            on: (event, callback) => {
              expected['wsEvent'] = event;
              callback(cdpFetchRequestPauseEvent);
            }
          },
          execute: function(command, params) {
            expected.cdpCommands.push(command);
            if (command === 'Fetch.fulfillRequest') {
              expected['requestId'] = params.requestId;
              expected['responseCode'] = params.responseCode;
              expected['responseHeaders'] = params.responseHeaders;
              expected['responseBody'] = params.body;
            }
          }
        });
      };

      client.api.mockNetworkResponse(undefined, undefined, function() {
        // Assert final response with response passed
        assert.strictEqual(expected.responseCode, 200);
        assert.deepEqual(expected.responseHeaders, []);
        assert.strictEqual(expected.responseBody, '');

        assert.strictEqual(expected.requestId, JSON.parse(cdpFetchRequestPauseEvent).params.requestId);
        assert.strictEqual(expected.wsEvent, 'message');
        assert.deepEqual(expected.cdpCommands, ['Fetch.fulfillRequest', 'Fetch.enable', 'Network.setCacheDisabled']);
      });

      client.start(done);
    });
  });

  it('browser.mockNetworkResponse - driver not supported', function(done){
    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'firefox'
      }
    }).then(client => {
      const response = {
        status: 200,
        headers: {'Content-Type': 'UTF-8'},
        body: 'Hey there!'
      };
      client.api.mockNetworkResponse('https://www.google.com', response, function(result){
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'MockNetworkResponse is not supported while using this driver');
      });
      client.start(done);
    });
  });

});
