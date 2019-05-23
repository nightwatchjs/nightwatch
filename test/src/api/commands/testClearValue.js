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
    Nightwatch.initClient({
      output: false,
      silent: true
    })
      .then(client => {
        MockServer.addMock({
          'url': '/wd/hub/session/1352110219202/element/0/clear',
          'response': {
            sessionId: '1352110219202',
            status: 0
          }
        });

        client.api.clearValue('#weblogin', function callback(result) {
          assert.strictEqual(result.status, 0);
          assert.strictEqual(this, client.api);
        })
          .clearValue('css selector', '#weblogin', function callback(result) {
            assert.strictEqual(result.status, 0);
          });

        client.start(done);
      });
  });

  it('client.clearValue() with invalid locate strategy', function(done) {
    Nightwatch.initClient({
      output: false,
      silent: true
    })
      .then(client => {
        client.api.clearValue('invalid strategy', '#weblogin', function callback(result) {
          assert.strictEqual(result.status, 0);
        });

        client.start(function(err) {
          try {
            assert.ok(err instanceof Error);
            assert.ok(err.message.includes('Provided locating strategy "invalid strategy" is not supported for .clearValue()'));
            done();
          } catch (e) {
            done(e);
          }
        });
      });
  });

  it('client.clearValue() with no callback', function(done) {
    Nightwatch.initClient({
      output: false,
      silent: false
    })
      .then(client => {
        MockServer.addMock({
          'url': '/wd/hub/session/1352110219202/element/0/clear',
          'response': {
            sessionId: '1352110219202',
            status: 0
          }
        });


        client.api.elements('css selector', 'body', res => {
          client.api.clearValue('#weblogin');
        });

        client.start(done);
      });
  });

  it('client.clearValue() with webdriver protocol', function(done) {
    Nightwatch.initClient({
      selenium : {
        version2: false,
        start_process: false
      },
      webdriver:{
        start_process: true
      },
    }).then(client => {
      MockServer.addMock({
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/clear',
        response: { value: null }
      }, true);

      MockServer.addMock({
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/clear',
        response: { value: null }
      }, true);

      client.api.clearValue('#webdriver', function(result) {
        assert.strictEqual(result.value, null);
      }).clearValue('css selector', '#webdriver', function(result) {
        assert.strictEqual(result.value, null);
      });

      client.start(done);
    });
  });

  it('client.clearValue() with webdriver protocol - element not found', function(done) {
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
        url: '/session/13521-10219-202/elements',
        postdata: { using: 'css selector', value: '#webdriver-notfound' },
        response: {
          value: {
            error: 'no such element',
            message: 'Unable to locate element: #webdriver-notfound',
            stacktrace: 'WebDriverError@chrome://marionette/content/error.js:172:5\nNoSuchElementError@chrome://marionette/content/error.js:400:5'
          }
        }
      }, true);

      client.api.clearValue({selector: '#webdriver-notfound', timeout: 0}, function(result) {
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.value.error, 'An error occurred while running .clearValue() command on <#webdriver-notfound>:');
        assert.strictEqual(result.value.message, 'An error occurred while running .clearValue() command on <#webdriver-notfound>:');
      });

      client.start(done);
    });
  });
});
