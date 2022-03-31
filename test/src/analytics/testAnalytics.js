const MockServer = require('../../lib/mockserver');
const Globals = require('../../lib/globals/commands');
const AnalyticsCollector = require('../../../lib/analytics');
const Settings = require('../../../lib/settings/settings');
const assert = require('assert');

describe.only('test analytics unitily', function() {
  this.timeout(100000);
    
  //   beforeEach(function(done) {
  //     // this.server = MockServer.init(null, {port: 13555});
  //     // this.server.on('listening', () => done());
  //   });

  //   afterEach(function(done) {
  //     Globals.afterEach.call(this, done);
  //   });

  it('sould send analytics data to GA', async function() {
    // MockServer.addMock({
    //   url: '/mp/collect',
    //   statusCode: 500,
    //   method: 'GET',
    //   response: {
    //     value: 'foo'
    //   }
    // });

    const settings = Settings.parse({
      analytics: {
        enabled: true,
        serverUrl: 'localhost:13555'
      }
    });

    const analytics = new AnalyticsCollector(settings);
    analytics.event('test', 'log');

    return analytics.flush().then((res) => {
      assert.notEqual(res, undefined);
    }).catch((err) => {
      assert.strictEqual(err, undefined);
    });
  });

});
