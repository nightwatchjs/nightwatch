const assert = require('assert');
const path = require('path');
const {Key} = require('selenium-webdriver');
const common = require('../../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

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
      postdata: {text: 'password', value: ['p', 'a', 's', 's', 'w', 'o', 'r', 'd']},
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
        assert.strictEqual(results.errmessages, []);

        const rawHttpOutput = results.modules.passwordValueRedacted.rawHttpOutput;
        const requests = rawHttpOutput.filter((req) => req[1].includes('/element/0/value') && req[1].includes('Request POST'));

        let foundRedactedText = false;
        let didNotFindNonRedactedText = true;

        for (var request of requests) {
          if (request[2].includes('redacted_text')) {
            foundRedactedText = true;
          }
          if (request[2].includes('non_redacted')) {
            didNotFindNonRedactedText = false;
          }
        }
        assert.strictEqual(foundRedactedText, false);
        assert.strictEqual(didNotFindNonRedactedText, false);
        
      }
    };

    await NightwatchClient.runTests(testsPath, settings({
      globals,
      output_folder: 'output',
      selenium_host: null,
      output: true
    }));

    assert.strictEqual(globalReporterCalled, true);
  });
});
