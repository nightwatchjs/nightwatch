const fs = require('fs').promises;

const Nocks = require('../../lib/nocks.js');
const analytics = require('../../../lib/analytics');
const Settings = require('../../../lib/settings/settings');
const assert = require('assert');

describe('test analytics utility', function() {
  this.timeout(10000);
  before(function() {
    const settings = Settings.parse({
      usage_analytics: {
        enabled: true,
        serverUrl: 'http://localhost:13555'
      }
    });
    analytics.updateSettings(settings);
  });

  afterEach(async function() {
    Nocks.cleanAll();
    try {
      const logfile = analytics.__getLogFileLocation();
      await fs.stat(logfile);
      await fs.unlink(logfile);
    } catch (e) {
      // Ignore
    }
  });

  it('should throw error if event parameters contain objects or arrays', function() {
    assert.throws(function() {
      analytics.event('test', {
        foo: {
          bar: 'bas'
        }
      });
    });

    assert.throws(function() {
      analytics.event('test', {
        foo: [1, 2, 3]
      });
    });
  });

  it('should write events to a log file', async function() {
    await analytics.event('test', {
      foo: 'bar'
    });
    const logFile = analytics.__getLogFileLocation();
    
    try {
      const stats = await fs.stat(logFile);
      assert.ok(stats.size > 0);
    } catch (e) {
      assert.fail(e);
    }
  });

  it('should have default parameters', async function() {
    await analytics.event('test', {
      foo: 'bar'
    });

    const logFile = analytics.__getLogFileLocation();
    const logFileContent = await fs.readFile(logFile, 'utf8');

    const logFileJson = JSON.parse(logFileContent);
    assert.ok(logFileJson.params.foo === 'bar');
    assert.ok(logFileJson.params.event_time);
    assert.ok(logFileJson.params.env_os);
    assert.ok(logFileJson.params.env_nw_version);
    assert.ok(logFileJson.params.env_node_version);
  });

  it('should send analytics data to GA', async function() {
    Nocks.analyticsCollector(analytics.__getGoogleAnalyticsPath()).active();
    
    analytics.event('test', {log: 'log'});

    await analytics.__flush().then((res) => {
      assert.notEqual(res, 'foo');
    }).catch((err) => {
      assert.strictEqual(err, undefined);
    });
  });

  it('should flush queue after around 5 events', async function() {
    Nocks.analyticsCollector(analytics.__getGoogleAnalyticsPath()).active();

    const flushBack = analytics.__flush;
    
    var called = false;
    analytics.__flush = function() {
      called = true;
    };

    analytics.event('test', {log: 'log'});
    analytics.event('test', {log: 'log'});
    analytics.event('test', {log: 'log'});
    analytics.event('test', {log: 'log'});
    analytics.event('test', {log: 'log'});
    analytics.event('test', {log: 'log'});

    assert.ok(called);
    analytics.__flush = flushBack;
  });
});
