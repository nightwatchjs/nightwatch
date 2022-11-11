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

  it('client.click() with xpath on iOS', function(done) {
    MockServer.addMock({
      url: '/session',
      response: {
        value: {
          sessionId: '13521-10219-202',
          capabilities: {
            browserName: 'safari',
            platformName: 'iOS',
            'safari:useSimulator': true,
            'safari:platformVersion': '15.6.1'
          }
        }
      },
      method: 'POST',
      statusCode: 201
    }, true);

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

    Nightwatch.initW3CClient({
      silent: false,
      output: false,
      desiredCapabilities: {
        browserName: 'safari',
        platformName: 'iOS',
        'safari:useSimulator': true
      }
    }).then((client) => {
      client.api.click('css selector', '#weblogin', function(result) {
        assert.strictEqual(result.status, 0);
      });
  
      client.start(done);
    });
  });
});
