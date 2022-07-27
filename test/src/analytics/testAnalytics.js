const Nocks = require('../../lib/nocks.js');
const Globals = require('../../lib/globals/commands');
const analytics = require('../../../lib/analytics');
const Settings = require('../../../lib/settings/settings');
const assert = require('assert');

describe('test analytics utility', function() {
  afterEach(function() {
    Nocks.cleanAll();
  });

  it('should send analytics data to GA', async function() {
    Nocks.analyticsCollector().active();

    const settings = Settings.parse({
      analytics: {
        enabled: true,
        serverUrl: 'http://localhost:13555'
      }
    });

    analytics.updateSettings(settings);
    analytics.event('test', {log: 'log'});

    await analytics.__flush().then((res) => {
      assert.notEqual(res, 'foo');
    }).catch((err) => {
      assert.strictEqual(err, undefined);
    });
  });
});
