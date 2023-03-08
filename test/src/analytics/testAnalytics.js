const assert = require('assert');
const fs = require('fs').promises;
const Nocks = require('../../lib/nocks.js');
const common = require('../../common.js');
const {Logger} = common.require('utils');
let analytics = common.require('utils/analytics.js');
const Settings = common.require('settings/settings.js');

function requireUncached(module) {
  delete require.cache[require.resolve(module)];

  return require(module);
}

describe('test analytics utility', function() {
  before(function() {
    Logger.disable();
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
    assert.rejects(async function() {
      await analytics.event('test', {
        foo: {
          bar: 'bas'
        }
      });
    });

    assert.rejects(async function() {
      await analytics.event('test', {
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
    const analyticsNock = Nocks.analyticsCollector(analytics.__getGoogleAnalyticsPath());

    await analytics.event('test', {log: 'log'});

    await analytics.__flush().then((res) => {
      analyticsNock.done();
    }).catch((err) => {
      assert.strictEqual(err, undefined);
    });
  });

  it('should flush queue after around 5 events', async function() {
    Nocks.analyticsCollector(analytics.__getGoogleAnalyticsPath());

    const flushBack = analytics.__flush;
    
    var called = false;
    analytics.__flush = function() {
      called = true;
    };

    await analytics.event('test', {log: 'log'});
    await analytics.event('test', {log: 'log'});
    await analytics.event('test', {log: 'log'});
    await analytics.event('test', {log: 'log'});
    await analytics.event('test', {log: 'log'});
    await analytics.event('test', {log: 'log'});

    assert.ok(called);
    analytics.__flush = flushBack;

    await analytics.__flush();
  });

  it('should flush queue after around 5 start up', async function() {
    Nocks.analyticsCollector(analytics.__getGoogleAnalyticsPath());

    const settings = Settings.parse({
      usage_analytics: {
        enabled: true,
        serverUrl: 'http://localhost:13555'
      }
    });
    
    let flushBack = analytics.__flush;
    var called = false;

    for (let i = 0; i < 7; i++) {
      analytics = requireUncached('../../../lib/utils/analytics.js');
    
      flushBack = analytics.__flush;
      analytics.__flush = function() {
        called = true;
      };
      analytics.updateSettings(settings);
      await analytics.event('test', {log: 'log'});
    }
    
    assert.ok(called);
    analytics.__flush = flushBack;

    await analytics.__flush();
  });

  it('should report only allowed exceptions', async function() {
    const analyticsNock = Nocks.analyticsCollector(analytics.__getGoogleAnalyticsPath());
    const err = new Error('test');
    err.name ='UserGeneratedError';

    await analytics.exception(err);

    const logFile = analytics.__getLogFileLocation();
    let logFileContent = await fs.readFile(logFile, 'utf8');
    let logFileJson = JSON.parse(logFileContent);

    assert.ok(logFileJson.params.errorName === 'CustomError');

    await analytics.__flush().then((res) => {
      analyticsNock.done();
    }).catch((err) => {
      assert.strictEqual(err, undefined);
    });
    

    const analyticsNock2 = Nocks.analyticsCollector(analytics.__getGoogleAnalyticsPath());
    err.name = 'SyntaxError';

    await analytics.exception(err);
    
    logFileContent = await fs.readFile(logFile, 'utf8');
    logFileJson = JSON.parse(logFileContent);
    
    assert.ok(logFileJson.params.errorName === 'SyntaxError');

    await analytics.__flush().then((res) => {
      analyticsNock2.done();
    }).catch((err) => {
      assert.strictEqual(err, undefined);
    });
  });
});
