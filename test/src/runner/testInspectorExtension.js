const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');
const mockery = require('mockery');

describe('testInspectorExtension', function () {

  beforeEach(function (done) {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');

    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  
    MockServer.addMock({
      url: '/wd/hub/session/13521-10219-202/elements',
      method: 'POST',
      postdata: JSON.stringify({using: 'css selector', value: '#weblogin'}),
      response: {
        value: [{
          'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'
        }]
      }
    }, false);
  
    MockServer.addMock({
      url: '/wd/hub/session/13521-10219-202/url',
      method: 'POST',
      postdata: JSON.stringify({
        url: 'http://localhost'
      }),
      response: {
        value: null
      }
    }, false);
  
    MockServer.addMock({
      url: '/wd/hub/session/13521-10219-202',
      method: 'DELETE',
      response: {
        value: null
      }
    }, false);
  
    mockery.registerMock('@nightwatch/nightwatch-inspector', {
      crxfile: 'mocked crxfile'
    });

    mockery.registerMock('./websocket-server', class {
      initSocket() {};
  
      closeSocket() {};
    });
  });

  afterEach(function (done) {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();

    CommandGlobals.afterEach.call(this, function () {
      Object.keys(require.cache).forEach(function (module) {
        delete require.cache[module];
      });

      done();
    });
  });

  it('extension should attach in debug mode', function() {
    MockServer.addMock({
      url: '/wd/hub/session',
      statusCode: 200,
      method: 'POST',
      postdata: JSON.stringify({
        capabilities: {
          firstMatch: [{}],
          alwaysMatch: {
            browserName: 'chrome',
            'goog:chromeOptions': {
              extensions: ['mocked crxfile'],
              args: ['--auto-open-devtools-for-tabs']
            }
          }
        }
      }),
      response: JSON.stringify({
        value: {
          sessionId: '13521-10219-202',
          capabilities: {
            acceptInsecureCerts: false,
            browserName: 'chrome',
            browserVersion: '65.0.1'
          }
        }
      })
    }, false);

    const testsPath = path.join(__dirname, '../../sampletests/simple/test/sample.js');
    let desiredCapabilities;

    const globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      beforeEach: function(client, cb) {
        desiredCapabilities = client.desiredCapabilities;
        cb();
      },
      reporter(results, cb) {
        assert.strictEqual(desiredCapabilities.browserName, 'chrome');
        assert.ok('goog:chromeOptions' in desiredCapabilities);
        assert.deepStrictEqual(desiredCapabilities['goog:chromeOptions'].extensions, ['mocked crxfile']);
        assert.deepStrictEqual(desiredCapabilities['goog:chromeOptions'].args, ['--auto-open-devtools-for-tabs']);
        assert.strictEqual(this.settings.parallel_mode, false);
        assert.strictEqual(results.passed, 2);
        assert.strictEqual(results.errors, 0);
        cb();
      }
    };

    return runTests({
      _source: [testsPath],
      debug: true
    }, settings({
      globals,
      output: false,
      desiredCapabilities: {
        browserName: 'chrome'
      }
    }));
  })

  it('extension should not attach if debug mode is false', function() {
    MockServer.addMock({
      url: '/wd/hub/session',
      statusCode: 200,
      method: 'POST',
      postdata: JSON.stringify({
        capabilities: {
          firstMatch: [{}],
          alwaysMatch: {
            browserName: 'chrome',
            'goog:chromeOptions': {}
          }
        }
      }),
      response: JSON.stringify({
        value: {
          sessionId: '13521-10219-202',
          capabilities: {
            acceptInsecureCerts: false,
            browserName: 'chrome',
            browserVersion: '65.0.1'
          }
        }
      })
    }, false);

    const testsPath = path.join(__dirname, '../../sampletests/simple/test/sample.js');
    let desiredCapabilities;

    const globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      beforeEach: function(client, cb) {
        desiredCapabilities = client.desiredCapabilities;
        cb();
      },
      reporter(results, cb) {
        assert.strictEqual(desiredCapabilities.browserName, 'chrome');
        assert.strictEqual('goog:chromeOptions' in desiredCapabilities, false);
        assert.strictEqual(this.settings.parallel_mode, false);
        assert.strictEqual(results.passed, 2);
        assert.strictEqual(results.errors, 0);
        cb();
      }
    };

    return runTests({
      _source: [testsPath]
    }, settings({
      globals,
      output: false,
      desiredCapabilities: {
        browserName: 'chrome'
      }
    }));
  })
})
