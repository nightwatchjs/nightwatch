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

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/value',
      method: 'POST',
      postdata: {
        text: Key.NULL + 'password',
        value: [Key.NULL, 'p', 'a', 's', 's', 'w', 'o', 'r', 'd']
      },
      response: {
        sessionId: '1352110219202',
        status: 0
      }
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/clear',
      method: 'POST',
      response: {
        sessionId: '1352110219202',
        status: 0
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
      output_folder: 'output'
    }));

  });
});
