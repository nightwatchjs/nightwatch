const assert = require('assert');
const Nightwatch = require('../../lib/nightwatch.js');
const MockServer  = require('../../lib/mockserver.js');
const common = require('../../common.js');
const SimplifiedReporter = common.require('reporter/simplified.js');

describe('element base commands', function() {
  before(function(done) {
    Nightwatch.startMockServer(done);
  });

  after(function(done) {
    Nightwatch.stop(done);
  });

  class Reporter extends SimplifiedReporter {
    constructor(settings) {
      super(settings);

      this.errors = 0;
    }

    registerTestError(err) {
      this.errors++;
    }
  }

  const reporter = new Reporter({});

  //////////////////////////////////////////////////////////////////////////////////////
  // .element()
  //////////////////////////////////////////////////////////////////////////////////////
  it('client.element()', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false
    });

    await Nightwatch.api()
      .element('css selector', '#weblogin', function callback(result) {
        assert.strictEqual(result.status, 0);
        assert.deepEqual(result.value, { ELEMENT: '0' });
      });

    return Nightwatch.start();
  });

  it('client.element() - unhandled error', async function() {
    const client = await Nightwatch.initClient({
      output: false,
      silent: false
    }, reporter);

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element',
      statusCode: 500,
      postdata: {
        using: 'css selector',
        value: '#element-error'
      },
      response: {
        sessionId: '1352110219202',
        state: 'unhandled error',
        value: {
          message: 'test message'
        },
        status: 13
      }
    }, true);

    client.api.element('css selector', '#element-error', function callback(result) {
      assert.deepStrictEqual(result, {
        status: -1,
        state: 'unhandled error',
        code: '',
        value: {
          message: 'test message',
          error: []
        },
        errorStatus: 13,
        error:
          'An unknown server-side error occurred while processing the command. – test message',
        httpStatusCode: 500
      });
    });

    await new Promise((resolve, reject) => {
      client.start(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    assert.strictEqual(client.reporter.errors, 0);
  });

  it('client.element() W3C Webdriver protocol', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false,
      selenium : {
        start_process: false,
      },
      webdriver:{
        start_process: true
      },
    });

    await Nightwatch.api()
      .element('css selector', '#webdriver', function callback(result) {
        assert.strictEqual(typeof result.status, 'undefined');
        assert.deepEqual(result.value, { 'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b' });
      });

    return Nightwatch.start();
  });

  it('client.element() with xpath', async function() {
    Nightwatch.addMock({
      url : '/session/13521-10219-202/element',
      postdata: JSON.stringify({
        using: 'xpath',
        value: '//weblogin'
      }),
      response : {
        value: {
          'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'
        }
      }
    }, true);

    await Nightwatch.initAsync({
      output: false,
      silent: false,
      selenium : {
        start_process: false,
      },
      webdriver:{
        start_process: true
      },
    });

    await Nightwatch.api()
      .element('xpath', '//weblogin', function callback(result) {
        assert.deepEqual(result.value, {
          'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'
        });
      });

    return Nightwatch.start();
  });

  it('client.element() NOT FOUND with W3C Webdriver protocol', async function() {
    Nightwatch.addMock({
      url : '/session/13521-10219-202/element',
      postdata: {
        using: 'css selector',
        value: '.not_found'
      },
      statusCode: 404,
      response: {
        value: {
          error: 'no such element',
          message: 'Unable to locate element: .not_found',
          stacktrace: ''
        }
      }
    }, true);

    await Nightwatch.initAsync({
      output: false,
      silent: false,
      selenium : {
        start_process: false,
      },
      webdriver:{
        start_process: true
      },
    });

    Nightwatch.api().element('css selector', '.not_found', function(result) {
      assert.strictEqual(result.error, 'Unable to locate element: .not_found');
      assert.strictEqual(result.status, -1);
      assert.strictEqual(result.httpStatusCode, 404);
      assert.deepEqual(result.value, {
        error: 'no such element',
        message: 'Unable to locate element: .not_found',
        stacktrace: ''
      });
    });

    return Nightwatch.start();
  });


  it('client.element() with 502 gateway error', async function() {
    Nightwatch.addMock({
      url : '/session/13521-10219-202/element',
      postdata: {
        using: 'css selector',
        value: '#weblogin-error'
      },
      contentType: 'text/plain',
      statusCode: 502,
      response: `<html>
<head>
<title>502 Bad Gateway</title>
</head>
<body></body>
</html>`
    }, true);

    await Nightwatch.initAsync({
      output: false,
      silent: false,
      selenium : {
        start_process: false,
      },
      webdriver:{
        start_process: true
      },
    });

    Nightwatch.api().element('css selector', '#weblogin-error', function(result) {
      assert.strictEqual(result.status, -1);
      assert.strictEqual(result.httpStatusCode, 502);
      assert.strictEqual(result.error, '<html>\n<head>\n<title>502 Bad Gateway</title>\n</head>\n<body></body>\n</html>');
      assert.deepStrictEqual(result.value, {
        error: 'internal server error',
        message: '<html>\n<head>\n<title>502 Bad Gateway</title>\n</head>\n<body></body>\n</html>'
      });
    });

    return Nightwatch.start();
  });

  //////////////////////////////////////////////////////////////////////////////////////
  // .elements()
  //////////////////////////////////////////////////////////////////////////////////////
  it('client.elements()', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false
    });

    await Nightwatch.api()
      .elements('css selector', '#weblogin', function callback(result) {
        assert.strictEqual(result.status, 0);
        assert.deepEqual(result.value, [ { ELEMENT: '0' } ]);
      });

    return Nightwatch.start();
  });

  it('client.elements() W3C Webdriver protocol', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false,
      selenium : {
        start_process: false,
      },
      webdriver:{
        start_process: true
      },
    });

    await Nightwatch.api()
      .elements('css selector', '#webdriver', function callback(result) {
        assert.strictEqual(typeof result.status, 'undefined');
        assert.deepEqual(result.value, [{
          'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'
        }, {
          'element-6066-11e4-a52e-4f735466cecf': '3783b042-7001-0740-a2c0-afdaac732e9f'
        }]);
      });

    return Nightwatch.start();
  });

  it('client.elements() with xpath', async function() {
    Nightwatch.addMock({
      url : '/session/13521-10219-202/elements',
      postdata: JSON.stringify({
        using: 'xpath',
        value: '//weblogin'
      }),
      response : {
        value: [{
          'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'
        }, {
          'element-6066-11e4-a52e-4f735466cecf': '3783b042-7001-0740-a2c0-afdaac732e9f'
        }]
      }
    }, true);

    await Nightwatch.initAsync({
      output: false,
      silent: false,
      selenium : {
        start_process: false,
      },
      webdriver:{
        start_process: true
      },
    });

    await Nightwatch.api()
      .elements('xpath', '//weblogin', function callback(result) {
        assert.deepEqual(result.value, [{
          'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'
        }, {
          'element-6066-11e4-a52e-4f735466cecf': '3783b042-7001-0740-a2c0-afdaac732e9f'
        }]);
      });

    return Nightwatch.start();
  });

  //////////////////////////////////////////////////////////////////////////////////////
  // .elementIdElement()
  //////////////////////////////////////////////////////////////////////////////////////
  it('client.elementIdElement()', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false
    });

    await Nightwatch.api()
      .elementIdElement('0', 'css selector', '#helpBtn', function callback(result) {
        assert.strictEqual(result.status, 0);
        assert.deepEqual(result.value, { ELEMENT: '1' });
      });

    return Nightwatch.start();
  });

  it('client.elementIdElement() with selector object', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false
    });

    await Nightwatch.api()
      .elementIdElement('0', 'css selector', {selector: '#helpBtn'}, function callback(result) {
        assert.strictEqual(result.status, 0);
        assert.deepEqual(result.value, { ELEMENT: '1' });
      });

    return Nightwatch.start();
  });

  it('client.elementIdElement() with wrong selector object', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false
    });

    let thrown;

    try {
      await Nightwatch.api().elementIdElement('0', 'css selector', {});
      await Nightwatch.start();
    } catch (err) {
      thrown = err;
    }

    assert.ok(thrown instanceof Error);
    assert.ok(thrown.message.includes('No selector property for selector object'));
  });

  //////////////////////////////////////////////////////////////////////////////////////
  // .elementIdElements()
  //////////////////////////////////////////////////////////////////////////////////////
  it('client.elementIdElements()', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false
    });

    await Nightwatch.api()
      .elementIdElements('0', 'css selector', '#helpBtn', function callback(result) {
        assert.strictEqual(result.status, 0);
        assert.deepEqual(result.value, [{ ELEMENT: '1' }]);
      });

    return Nightwatch.start();
  });

  it('client.elementIdElements() with index', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false
    });

    await Nightwatch.api()
      .elementIdElements('0', 'css selector', {selector: '#helpBtn', index: 0}, function callback(result) {
        assert.strictEqual(result.status, 0);
        assert.deepEqual(result.value, [{ ELEMENT: '1' }]);
      });

    return Nightwatch.start();
  });

  it('client.elementIdElements() with wrong index', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false
    });

    await Nightwatch.api()
      .elementIdElements('0', 'css selector', {selector: '#helpBtn', index: 1}, function callback(result) {
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.value, null);
      });

    return Nightwatch.start();
  });

  it('client.elementIdElements() with wrong selector object', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false
    });

    let thrown;

    try {
      await Nightwatch.api().elementIdElements('0', 'css selector', {});
      await Nightwatch.start();
    } catch (err) {
      thrown = err;
    }

    assert.ok(thrown instanceof Error);
    assert.ok(thrown.message.includes('No selector property for selector object'));
  });

  //////////////////////////////////////////////////////////////////////////////////////
  // .isVisible({selector, suppressNotFoundErrors})
  //////////////////////////////////////////////////////////////////////////////////////
  it('client.isVisible() NOT FOUND with W3C Webdriver protocol', async function() {
    Nightwatch.addMock({
      url : '/session/13521-10219-202/elements',
      postdata: {
        using: 'css selector',
        value: '.not_found'
      },
      statusCode: 404,
      response: {
        value: {
          error: 'no such element',
          message: 'Unable to locate element: .not_found',
          stacktrace: ''
        }
      }
    }, true);

    Nightwatch.addMock({
      url : '/session/13521-10219-202/elements',
      postdata: {
        using: 'css selector',
        value: '.not_found'
      },
      statusCode: 404,
      response: {
        value: {
          error: 'no such element',
          message: 'Unable to locate element: .not_found',
          stacktrace: ''
        }
      }
    }, true);

    let expectedError;

    await Nightwatch.initAsync({
      output: false,
      silent: false,
      selenium : {
        start_process: false,
      },
      webdriver:{
        start_process: true
      }
    }, {
      registerTestError(err) {
        expectedError = err;
      }
    });

    Nightwatch.api().isVisible({selector: '.not_found', timeout: 10, retryInterval: 100, suppressNotFoundErrors: false}, function(result, instance) {
      assert.ok(expectedError instanceof Error);
      assert.strictEqual(expectedError.name, 'NoSuchElementError');
      assert.strictEqual(instance.suppressNotFoundErrors, false);
      assert.strictEqual(result.status, -1);
      assert.strictEqual(result.value.error,'An error occurred while running .isVisible() command on <.not_found>: no such element; Unable to locate element: .not_found');
    });

    return Nightwatch.start();
  });

  it('client.isVisible() NOT FOUND with suppressed errors', async function() {
    Nightwatch.addMock({
      url : '/session/13521-10219-202/elements',
      postdata: {
        using: 'css selector',
        value: '.not_found'
      },
      statusCode: 404,
      response: {
        value: {
          error: 'no such element',
          message: 'Unable to locate element: .not_found',
          stacktrace: ''
        }
      }
    }, true);

    Nightwatch.addMock({
      url : '/session/13521-10219-202/elements',
      postdata: {
        using: 'css selector',
        value: '.not_found'
      },
      statusCode: 404,
      response: {
        value: {
          error: 'no such element',
          message: 'Unable to locate element: .not_found',
          stacktrace: ''
        }
      }
    }, true);

    let expectedError;

    await Nightwatch.initAsync({
      output: false,
      silent: false,
      selenium : {
        start_process: false,
      },
      webdriver:{
        start_process: true
      }
    }, {
      registerTestError(err) {
        expectedError = err;
      }
    });

    Nightwatch.api().isVisible({selector: '.not_found', timeout: 10, retryInterval: 100, suppressNotFoundErrors: true}, function(result, instance) {
      assert.strictEqual(typeof expectedError, 'undefined');
      assert.strictEqual(instance.suppressNotFoundErrors, true);
      assert.deepStrictEqual(result, {
        status: -1,
        code: '',
        value:
          {
            error: 'no such element',
            message: 'Unable to locate element: .not_found',
            stacktrace: ''
          },
        errorStatus: '',
        error: 'Unable to locate element: .not_found',
        httpStatusCode: 404
      });

    });

    return Nightwatch.start();
  });
});
