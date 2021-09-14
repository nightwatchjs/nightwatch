const nock = require('nock');
const assert = require('assert');

const common = require('../../common.js');
const Nightwatch = require('../../lib/nightwatch.js');
const HttpRequest = common.require('http/request.js');
const WebdriverProtocol = common.require('transport');
const SeleniumProtocol = common.require('transport/selenium-webdriver/selenium.js');

describe('Trandport.runProtocolAction', function() {
  const nightwatch = Nightwatch.createClientDefaults();

  before(function() {
    HttpRequest.globalSettings = {
      default_path: '',
      port: 4444,
      host: 'localhost'
    };
  });

  beforeEach(function () {
    try {
      nock.activate();
    } catch (err) {
    }
  });

  afterEach(function() {
    nock.restore();
  });

  it('test runProtocolAction W3C Webdriver - socket hang up error', function() {
    nock('http://localhost:4444')
      .post('/session/123456/url')
      .replyWithError({
        message: 'socket hang up',
        code: 'ECONNRESET'
      });

    const transport = new WebdriverProtocol(nightwatch);

    return transport.runProtocolAction({
      path: '/session/123456/url',
      data: {
        url: 'http://localhost'
      },
      method: 'POST'
    }).then(result => {
      throw new Error('An error should be thrown');
    }).catch(err => {
      assert.deepStrictEqual(err, {
        status: -1,
        code: 'ECONNRESET',
        value: null,
        errorStatus: '',
        error: 'Error ECONNRESET: socket hang up',
        httpStatusCode: null
      });
    });
  });

  it('test runProtocolAction W3C Webdriver - invalid session id error', function() {
    nock('http://localhost:4444')
      .post('/session/123456/url')
      .reply(404, {
        value: {
          error: 'invalid session id',
          message: 'No active session with ID',
          stacktrace: ''
        }
      });

    const transport = new WebdriverProtocol(nightwatch);

    return transport.runProtocolAction({
      path: '/session/123456/url',
      data: {
        url: 'http://localhost'
      },
      method: 'POST'
    }).then(result => {
      assert.deepStrictEqual(result, {
        value: {
          error: 'invalid session id',
          message: 'No active session with ID',
          stacktrace: ''
        }
      });
    });
  });


  it('test runProtocolAction W3C Webdriver - command error', function() {
    nock('http://localhost:4444')
      .post('/session/123456/url')
      .reply(400, {
        value: {
          error: 'unexpected alert open',
          message: '',
          stacktrace: '',
          data: {
            text: 'Message from window.alert'
          }
        }
      });

    const transport = new WebdriverProtocol(nightwatch);

    return transport.runProtocolAction({
      path: '/session/123456/url',
      data: {
        url: 'http://localhost'
      },
      method: 'POST'
    }).then(result => {
      assert.deepStrictEqual(result, {
        value: {
          error: 'unexpected alert open',
          message: '',
          stacktrace: '',
          data: {text: 'Message from window.alert'}
        }
      });
    });
  });

  it('test runProtocolAction SeleniumServer - command error', function() {
    nock('http://localhost:4444')
      .post('/session/123456/window/new')
      .reply(500, {
        value: {
          stacktrace:
              'org.openqa.selenium.UnsupportedCommandException: POST /session/84e7ae34-f100-fe4c-bfd1-75178b9bb522/window/new\nBuild info: version: \'3.141.59\', revision: \'e82be7d358\', time: \'2018-11-14T08:25:53\'\nSystem info: host: \'MacBook-Pro-3.local\', ip: \'fe80:0:0:0:1cb3:9eb6:e69a:7912%en0\', os.name: \'Mac OS X\', os.arch: \'x86_64\', os.version: \'10.15.4\', java.version: \'1.8.0_161\'\nDriver info: driver.version: unknown\n\tat org.openqa.selenium.remote.http.AbstractHttpCommandCodec.decode(AbstractHttpCommandCodec.java:261)\n\tat org.openqa.selenium.remote.http.AbstractHttpCommandCodec.decode(AbstractHttpCommandCodec.java:117)\n\tat org.openqa.selenium.grid.session.remote.ProtocolConverter.handle(ProtocolConverter.java:74)\n\tat org.openqa.selenium.grid.session.remote.RemoteSession.execute(RemoteSession.java:129)\n\tat org.openqa.selenium.remote.server.WebDriverServlet.lambda$handle$0(WebDriverServlet.java:235)\n\tat java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:511)\n\tat java.util.concurrent.FutureTask.run(FutureTask.java:266)\n\tat java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)\n\tat java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)\n\tat java.lang.Thread.run(Thread.java:748)\n',
          stackTrace: [],
          message:
              'POST /session/84e7ae34-f100-fe4c-bfd1-75178b9bb522/window/new\nBuild info: version: \'3.141.59\', revision: \'e82be7d358\', time: \'2018-11-14T08:25:53\'\nSystem info: host: \'MacBook-Pro-3.local\', ip: \'fe80:0:0:0:1cb3:9eb6:e69a:7912%en0\', os.name: \'Mac OS X\', os.arch: \'x86_64\', os.version: \'10.15.4\', java.version: \'1.8.0_161\'\nDriver info: driver.version: unknown',
          error: 'unknown command'
        },
        status: 9
      });

    const transport = new SeleniumProtocol(nightwatch);

    return transport.runProtocolAction({
      path: '/session/123456/window/new',
      data: {
        url: 'http://localhost'
      },
      method: 'POST'
    }).then(result => {
      assert.deepStrictEqual(result, {
        status: 9,
        value: {
          stacktrace: '',
          stackTrace: [],
          message:
              'POST /session/84e7ae34-f100-fe4c-bfd1-75178b9bb522/window/new\nBuild info: version: \'3.141.59\', revision: \'e82be7d358\', time: \'2018-11-14T08:25:53\'\nSystem info: host: \'MacBook-Pro-3.local\', ip: \'fe80:0:0:0:1cb3:9eb6:e69a:7912%en0\', os.name: \'Mac OS X\', os.arch: \'x86_64\', os.version: \'10.15.4\', java.version: \'1.8.0_161\'\nDriver info: driver.version: unknown',
          error: 'unknown command'
        }
      });
    });
  });

  it('test runProtocolAction SeleniumServer - socket hang up error', function() {
    nock('http://localhost:4444')
      .post('/session/123456/url')
      .replyWithError({
        message: 'socket hang up',
        code: 'ECONNRESET'
      });

    const transport = new SeleniumProtocol(nightwatch);

    return transport.runProtocolAction({
      path: '/session/123456/url',
      data: {
        url: 'http://localhost'
      },
      method: 'POST'
    }).then(result => {
      throw new Error('An error should be thrown');
    }).catch(err => {
      assert.deepStrictEqual(err, {
        status: -1,
        code: 'ECONNRESET',
        value: null,
        errorStatus: '',
        error: 'Error ECONNRESET: socket hang up',
        httpStatusCode: null
      });
    });
  });
});
