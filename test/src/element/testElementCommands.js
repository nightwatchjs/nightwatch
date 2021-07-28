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
        assert.deepStrictEqual(result.value, '0');
      });

    return Nightwatch.start();
  });

  it('client.element() - unhandled error', async function() {
    const client = await Nightwatch.initClient({
      webdriver: {
        start_process: false
      },
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
      assert.ok(result.error instanceof Error);
      assert.strictEqual(result.status, -1);
      assert.strictEqual(result.error.message, 'test message');
      assert.strictEqual(result.error.name, 'WebDriverError');
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

  it('client.element() W3C Webdriver protocol', async function () {
    await Nightwatch.initAsync({
      output: false,
      silent: false,
      webdriver: {
        start_process: false
      }
    });

    await Nightwatch.api().element('css selector', '#webdriver', function callback(result) {
      assert.strictEqual(typeof result.status, 'number');
      assert.strictEqual(result.value, '5cc459b8-36a8-3042-8b4a-258883ea642b');
    });

    return Nightwatch.start();
  });

  it('client.element() with xpath', async function () {
    await Nightwatch.initAsync({
      output: false,
      silent: false,
      webdriver: {
        start_process: false
      }
    });

    await Nightwatch.api().element('xpath', '//webdriver', function callback(result) {
      assert.strictEqual(result.value, '5cc459b8-36a8-3042-8b4a-258883ea642b');
    });

    return Nightwatch.start();
  });

  it('client.element() NOT FOUND with W3C Webdriver protocol', async function() {
    Nightwatch.addMock({
      url: '/session/13521-10219-202/element',
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

    const client = await Nightwatch.initW3CClient({
      output: false,
      silent: false,
      webdriver: {
        start_process: false
      }
    });

    await client.api.element('css selector', '.not_found', function(result) {
      assert.strictEqual(result.error, 'Unable to locate element: .not_found');
      assert.strictEqual(result.status, -1);
      assert.strictEqual(result.httpStatusCode, 404);
      assert.deepStrictEqual(result.value, {
        error: 'no such element',
        message: 'Unable to locate element: .not_found',
        stacktrace: ''
      });
    });

    return client.start();
  });


  it('client.element() with 502 gateway error', async function () {
    Nightwatch.addMock(
      {
        url: '/session/13521-10219-202/element',
        postdata: {
          using: 'css selector',
          value: '#weblogin-error'
        },
        contentType: 'text/plain',
        statusCode: 502,
        response: `
        <html>
          <head>
            <title>502 Bad Gateway</title>
          </head>
          <body></body>
        </html>`
      },
      true
    );

    const client = await Nightwatch.initW3CClient({
      output: false,
      silent: false,
      webdriver: {
        start_process: false
      }
    });

    client.api.element('css selector', '#weblogin-error', function (result) {
      assert.strictEqual(result.status, -1);
      assert.strictEqual(result.httpStatusCode, 502);
      assert.strictEqual(
        result.error,
        '<html>\n<head>\n<title>502 Bad Gateway</title>\n</head>\n<body></body>\n</html>'
      );
      assert.deepStrictEqual(result.value, {
        error: 'internal server error',
        message: '<html>\n<head>\n<title>502 Bad Gateway</title>\n</head>\n<body></body>\n</html>'
      });
    });

    return client.start();
  });

  //////////////////////////////////////////////////////////////////////////////////////
  // .findElement()
  //////////////////////////////////////////////////////////////////////////////////////
  it('client.findElement()', async function () {
    await Nightwatch.initAsync({
      output: false,
      silent: false,
      webdriver: {
        start_process: false
      }
    });

    await Nightwatch.api().findElement('#webdriver', function callback(result) {
      assert.strictEqual(result.status, 0);
      assert.deepStrictEqual(result.value.ELEMENT, '5cc459b8-36a8-3042-8b4a-258883ea642b');
    });

    return Nightwatch.start();
  });

  it('client.findElement() with strategy', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false,
      webdriver: {
        start_process: false
      }
    });

    await Nightwatch.api().findElement({selector: '#webdriver', locateStrategy: 'css selector'}, function callback(result) {
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value.ELEMENT,  '5cc459b8-36a8-3042-8b4a-258883ea642b');
    });

    return Nightwatch.start();
  });

  //////////////////////////////////////////////////////////////////////////////////////
  // .elements()
  //////////////////////////////////////////////////////////////////////////////////////
  it('client.elements()', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false,
      webdriver: {
        start_process: false
      }
    });

    await Nightwatch.api()
      .elements('css selector', '#webdriver', function callback(result) {
        assert.strictEqual(typeof result.status, 'number');
        assert.deepStrictEqual(result.value, [{
          ELEMENT: '5cc459b8-36a8-3042-8b4a-258883ea642b'
        }, {
          ELEMENT: '3783b042-7001-0740-a2c0-afdaac732e9f'
        }]);
      });

    return Nightwatch.start();
  });

  it('client.elements() with xpath', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false,
      selenium: {
        start_process: false
      },
      webdriver: {
        start_process: false
      }
    });

    await Nightwatch.api()
      .elements('xpath', '//webdriver', function callback(result) {
        assert.deepStrictEqual(result.value, [{
          ELEMENT: '5cc459b8-36a8-3042-8b4a-258883ea642b'
        }, {
          ELEMENT: '3783b042-7001-0740-a2c0-afdaac732e9f'
        }]);
      });

    return Nightwatch.start();
  });

  //////////////////////////////////////////////////////////////////////////////////////
  // .findElements()
  //////////////////////////////////////////////////////////////////////////////////////
  it('client.findElements()', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false,
      webdriver: {
        start_process: false
      }
    });

    await Nightwatch.api()
      .findElements({locateStrategy: 'css selector', selector: '#webdriver'}, function callback(result) {
        assert.strictEqual(result.status, 0);
        assert.strictEqual(result.value.length, 2);
        assert.strictEqual(result.value[0].ELEMENT, '5cc459b8-36a8-3042-8b4a-258883ea642b');
        assert.strictEqual(result.value[1].ELEMENT, '3783b042-7001-0740-a2c0-afdaac732e9f');
      });

    return Nightwatch.start();
  });

  it('client.findElements() with default locate strategy', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false,
      webdriver: {
        start_process: false
      }
    });

    await Nightwatch.api().findElements('#webdriver', function callback(result) {
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value.length, 2);
      assert.strictEqual(result.value[0].ELEMENT, '5cc459b8-36a8-3042-8b4a-258883ea642b');
      assert.strictEqual(result.value[1].ELEMENT, '3783b042-7001-0740-a2c0-afdaac732e9f');
    });

    return Nightwatch.start();
  });

  it('client.findElements() with xpath', async function() {
    Nightwatch.addMock({
      url: '/session/1352110219202/elements',
      postdata: JSON.stringify({
        using: 'xpath',
        value: '//webdriver'
      }),
      response: {
        value: [{
          ELEMENT: '5cc459b8-36a8-3042-8b4a-258883ea642b'
        }, {
          ELEMENT: '3783b042-7001-0740-a2c0-afdaac732e9f'
        }]
      }
    }, true);

    await Nightwatch.initAsync({
      output: false,
      silent: false,
      selenium: {
        start_process: false
      },
      webdriver: {
        start_process: false
      }
    });

    await Nightwatch.api()
      .findElements({locateStrategy: 'xpath', selector: '//webdriver'}, function callback(result) {
        assert.strictEqual(result.value.length, 2);
        assert.strictEqual(result.value[0].ELEMENT, '5cc459b8-36a8-3042-8b4a-258883ea642b');
        assert.strictEqual(result.value[1].ELEMENT, '3783b042-7001-0740-a2c0-afdaac732e9f');
      });

    return Nightwatch.start();
  });

  //////////////////////////////////////////////////////////////////////////////////////
  // .elementIdElement()
  //////////////////////////////////////////////////////////////////////////////////////
  it('client.elementIdElement()', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false,
      webdriver: {
        start_process: false
      }
    });

    await Nightwatch.api().elementIdElement('0', 'css selector', '#helpBtn', function callback(result) {
      assert.strictEqual(result.status, 0);
      assert.deepStrictEqual(result.value, {ELEMENT: '1'});
    });

    return Nightwatch.start();
  });

  it('client.elementIdElement() with selector object', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false,
      webdriver: {
        start_process: false
      }
    });

    await Nightwatch.api().elementIdElement('0', 'css selector', {selector: '#helpBtn'}, function callback(result) {
      assert.strictEqual(result.status, 0);
      assert.deepStrictEqual(result.value, {ELEMENT: '1'});
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
      .elementIdElements('0', 'css selector', '.btn', function callback(result) {
        assert.strictEqual(result.status, 0);
        assert.deepStrictEqual(result.value, [{ELEMENT: '1'}, {ELEMENT: '2'}, {ELEMENT: '3'}]);
      });

    return Nightwatch.start();
  });

  it('client.elementIdElements() with index', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false
    });

    await Nightwatch.api()
      .elementIdElements('0', 'css selector', {selector: '.btn', index: 1}, function callback(result) {
        assert.strictEqual(result.status, 0);
        assert.deepStrictEqual(result.value, [{ELEMENT: '2'}]);
      });

    return Nightwatch.start();
  });

  it('client.elementIdElements() with wrong index', async function() {
    await Nightwatch.initAsync({
      output: false,
      silent: false
    });

    await Nightwatch.api()
      .elementIdElements('0', 'css selector', {selector: '.btn', index: 4}, function callback(result) {
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
  it('client.isVisible() NOT FOUND', async function() {
    let expectedError;

    await Nightwatch.initAsync({
      output: false,
      silent: false,
      selenium: {
        start_process: false
      },
      webdriver: {
        start_process: false
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
      assert.strictEqual(result.value.error, 'An error occurred while running .isVisible() command on <.not_found>: unable to locate element using css selector');
    });

    return Nightwatch.start();
  });

  it('client.isVisible() NOT FOUND with suppressed errors', async function() {
    Nightwatch.addMock({
      url: '/session/13521-10219-202/elements',
      postdata: {
        using: 'css selector',
        value: '.not_found'
      },
      statusCode: 404,
      response: {
        'error': 'unable to locate element using css selector',
        'status': 0,
        'value': []
      }
    }, true);

    let expectedError;

    await Nightwatch.initAsync({
      output: false,
      silent: false,
      selenium: {
        start_process: false
      },
      webdriver: {
        start_process: false
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
        error: 'unable to locate element using css selector',
        status: 0,
        value: []
      });

    });

    return Nightwatch.start();
  });
});
