const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const Nightwatch = require('../../../lib/nightwatch.js');

describe('clearValue', function() {
  before(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => {
      done();
    });
  });

  after(function(done) {
    this.server.close(function () {
      done();
    });
  });

  it('client.clearValue()', function(done) {
    Nightwatch.initClient()
      .then(client => {
        MockServer.addMock({
          'url': '/wd/hub/session/1352110219202/element/0/clear',
          'response': JSON.stringify({
            sessionId: '1352110219202',
            status: 0
          })
        });

        client.api.clearValue('#weblogin', function callback(result) {
          assert.equal(result.status, 0);
        }).clearValue('css selector', '#weblogin', function callback(result) {
          assert.equal(result.status, 0);
        });

        client.start(done);
      });
  });

  it('client.clearValue() with webdriver protocol', function(done) {
    Nightwatch.initClient({
      selenium : {
        version2: false
      }
    }).then(client => {
      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/clear',
        response: JSON.stringify({
          sessionId: '1352110219202',
          status: 0
        })
      }, true);

      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/clear',
        response: JSON.stringify({
          sessionId: '1352110219202',
          status: 0
        })
      }, true);

      client.api.clearValue('#webdriver', function(result) {
        assert.equal(result.status, 0);
      }).clearValue('css selector', '#webdriver', function(result) {
        assert.equal(result.status, 0);
      });

      client.start(done);
    });
  });

  it('client.clearValue() with webdriver protocol - element not found', function(done) {
    const common = require('../../../common.js');
    const Logger = common.require('util/logger.js');
    const loggerError = Logger.error;

    MockServer.addMock({
      url: '/session',
      postdata: JSON.stringify({
        desiredCapabilities: {
          browserName: 'firefox',
          acceptSslCerts: true,
          platform: 'ANY'
        }
      }),
      response: JSON.stringify({
        value: {
          sessionId: 'af8b7f38-4ea7-984b-b534-a206cd7c3afa',
          capabilities: {
            acceptInsecureCerts: false,
            browserName: 'firefox',
            browserVersion: '59.0.2'
          }
        }
      })
    }, true);

    Nightwatch.initClient({
      selenium : {
        version2: false,
        start_process: false
      },
      webdriver:{
        start_process: true
      },
      silent: true,
      output: false
    }).then(client => {
      MockServer.addMock({
        statusCode: 404,
        url: '/session/af8b7f38-4ea7-984b-b534-a206cd7c3afa/element',
        postdata: JSON.stringify({ using: 'css selector', value: '#webdriver-notfound' }),
        response: JSON.stringify({
          value: {
            error: 'no such element',
            message: 'Unable to locate element: #webdriver-notfound',
            stacktrace: 'WebDriverError@chrome://marionette/content/error.js:172:5\nNoSuchElementError@chrome://marionette/content/error.js:400:5'
          }
        })
      }, true);

      let loggedErr;
      Logger.error = function(err) {
        try {
          assert.equal(err, 'Error while running .locateSingleElement() protocol action: Unable to locate element: #webdriver-notfound\n');
        } catch (ex) {
          loggedErr = ex;
        }
      };

      client.api.clearValue('#webdriver-notfound', function(result) {
        assert.equal(result.status, -1);
        assert.equal(result.value.error, 'no such element');
        assert.equal(result.value.message, 'Unable to locate element: #webdriver-notfound');
      });

      client.start(function(err) {
        done(loggedErr ? loggedErr : err);

        Logger.error = loggerError;
      });
    });
  });
});
