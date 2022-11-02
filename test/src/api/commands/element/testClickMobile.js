const assert = require('assert');
const Nightwatch = require('../../../../lib/nightwatch.js');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('.click()', function() {
  beforeEach(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => done());
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.click() with xpath on iOS', async function() {
    const client = await Nightwatch.initW3CClient({
      silent: false,
      output: false,
      desiredCapabilities: {
        browserName: 'safari',
        platformName: 'iOS',
        'safari:useSimulator': true
      }
    }, {deviceId: '00008030-00024C2C3453402E'});
    
    MockServer.addMock({
      url: '/session/13521-10219-202/execute/sync',
      postdata: {
        'script': 'arguments[0].click();',
        'args': [{'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b', 'ELEMENT': '5cc459b8-36a8-3042-8b4a-258883ea642b'}]
      },
      response: JSON.stringify({
        sessionId: '13521-10219-202',
        status: 0
      })
    });
  
    let firstResult; let secondResult;

    await client.api.useXpath().click('//weblogin', function(result) {
      firstResult = result;
    });

    await client.api.click('css selector', '#weblogin', function(result) {
      secondResult = result;
    });

    await client.start();

    assert.strictEqual(firstResult.status, 0);
    assert.strictEqual(secondResult.status, 0);
  });
});
