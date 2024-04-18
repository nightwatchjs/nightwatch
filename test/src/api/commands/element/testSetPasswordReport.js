const assert = require('assert');
const path = require('path');
const {Key} = require('selenium-webdriver');
const common = require('../../../../common.js');
const Mocks  = require('../../../../lib/command-mocks.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');
const MockServer  = require('../../../../lib/mockserver.js');

describe('setPassword report check', function() {
  before(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => done());
  });

  after(function(done) {
    this.server.close(function() {
      done();
    });
  });

  it('client.setPassword() value redacted in rawHttpOutput', async function() {
    let sendKeysPasswordMockCalled = false;
    let sendKeysNormalMockCalled = false;
    let globalReporterCalled = false;

    Mocks.createNewW3CSession({
      testName: 'Actions API demo tests'
    });

    MockServer.addMock({
      url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/clear',
      method: 'POST',
      statusCode: 200,
      response: {
        value: null
      },
      times: 2
    });

    MockServer.addMock({
      url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/value',
      method: 'POST',
      postdata: {text: Key.NULL + 'password', value: [Key.NULL, 'p', 'a', 's', 's', 'w', 'o', 'r', 'd']},
      response: {
        value: null
      },
      onRequest: () => {
        sendKeysPasswordMockCalled = true;
      }
    }, true);

    MockServer.addMock({
      url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/value',
      method: 'POST',
      postdata: {text: 'simpletext', value: ['s', 'i', 'm', 'p', 'l', 'e', 't', 'e', 'x', 't']},
      response: {
        value: null
      },
      onRequest: () => {
        sendKeysNormalMockCalled = true;
      }
    }, true);

    const testsPath = [
      path.join(__dirname, '../../../../sampletests/passwordValueRedacted/passwordValueRedacted.js')
    ];

    const globals = {
      reporter(results) {
        globalReporterCalled = true;

        assert.strictEqual(sendKeysPasswordMockCalled, true);
        assert.strictEqual(sendKeysNormalMockCalled, true);
        assert.strictEqual(results.errmessages.length, 0);

        const rawHttpOutput = results.modules.passwordValueRedacted.rawHttpOutput;
        const requests = rawHttpOutput
          .filter((req) => {
            return req[1].includes('element/5cc459b8-36a8-3042-8b4a-258883ea642b/value') &&
              req[1].includes('Request POST');
          });

        assert.strictEqual(requests.length, 2);

        // First request (setPassword) should contain redacted value
        assert.strictEqual(requests[0][2].includes('password'), false);
        assert.strictEqual(requests[0][2].includes('*******'), true);

        // Second request (setValue) should NOT contain redacted value
        assert.strictEqual(requests[1][2].includes('simpletext'), true);
        assert.strictEqual(requests[1][2].includes('*******'), false);
      }
    };

    await NightwatchClient.runTests(testsPath, settings({
      globals,
      output_folder: 'output',
      selenium_host: null
    }));

    assert.strictEqual(globalReporterCalled, true);
  });
});
