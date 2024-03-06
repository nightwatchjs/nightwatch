const assert = require('assert');
const path = require('path');
const {Key} = require('selenium-webdriver');
const common = require('../../../../common.js');
const Mocks  = require('../../../../lib/command-mocks.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');
const MockServer  = require('../../../../lib/mockserver.js');

describe('setPassword check', function() {

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

    let sendKeysRedactedMockCalled = false;
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
      }
    });

    MockServer.addMock({
      url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/value',
      method: 'POST',
      postdata: {text: Key.NULL + 'password', value: [Key.NULL, 'p', 'a', 's', 's', 'w', 'o', 'r', 'd']},
      response: {
        value: null
      },
      onRequest: () => {
        sendKeysRedactedMockCalled = true;
      }
    });

    MockServer.addMock({
      url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/clear',
      method: 'POST',
      statusCode: 200,
      response: {
        value: null
      }
    });

    MockServer.addMock({
      url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/value',
      method: 'POST',
      postdata: {text: 'simpletext', value: ['s', 'i', 'm', 'p', 'l', 'e', 't', 'e', 'x', 't']},
      response: {
        value: null
      },
      onRequest: () => {
        sendKeysRedactedMockCalled = true;
      }
    });

    const testsPath = [
      path.join(__dirname, '../../../../sampletests/checkValueRedacted/passwordValueRedacted.js')
    ];

    const globals = {
      calls: 0,
      waitForConditionTimeout: 10,
      waitForConditionPollInterval: 10,
      reporter(results) {
        globalReporterCalled = true;

        assert.strictEqual(sendKeysRedactedMockCalled, true);
        assert.strictEqual(results.errmessages.length, 0);

        const rawHttpOutput = results.modules.passwordValueRedacted.rawHttpOutput;
        const requests = rawHttpOutput.filter((req) => req[1].includes('element/5cc459b8-36a8-3042-8b4a-258883ea642b/value') && req[1].includes('Request POST'));

        // There are two calls in passwordValueRedacted.js test, setPassword('password') & setValue('simpletext')
        // We first filter out the https requests that can contain these values as logs. Then we check these logs for our values.
        // There are two flags:
        // `foundRedactedText` which tracks if any redacted text is present in the log. So the value should be false only.
        // `foundNonRedactedText` tracks that the non redacted values SHOULD be present in the logs. So the value should become true.

        let foundRedactedText = false;
        let foundNonRedactedText = false;

        for (var request of requests) {
          if (request[2].includes('password')) {
            foundRedactedText = true;
          }
          if (request[2].includes('simpletext')) {
            foundNonRedactedText = true;
          }
        }
        assert.strictEqual(foundRedactedText, false);
        assert.strictEqual(foundNonRedactedText, true);
        
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
