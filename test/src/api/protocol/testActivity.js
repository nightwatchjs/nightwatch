const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('Android activity commands', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testStartActivity with correct options', function() {
    const opts = {
      appPackage: 'org.wikipedia',
      appActivity: 'org.wikipedia.main.MainActivity',
      appWaitActivity: 'org.wikipedia.onboarding.InitialOnboardingActivity'
    };

    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/appium/device/start_activity');
        assert.deepStrictEqual(opts.data, {
          appPackage: 'org.wikipedia',
          appActivity: 'org.wikipedia.main.MainActivity',
          appWaitActivity: 'org.wikipedia.onboarding.InitialOnboardingActivity'
        });
      },
      commandName: 'appium.startActivity',
      args: [opts]
    });
  });

  it('testStartActivity with no options', function() {
    return Globals.protocolTest({
      commandName: 'appium.startActivity',
      args: []
    }).catch(err => {
      return err;
    }).then((result) => {
      assert.ok(result instanceof Error);
      assert.strictEqual(result.message.includes('Please provide both appPackage and appActivity options while using startActivity.'), true);
    });
  });

  it('testGetCurrentActivity', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.path, '/session/1352110219202/appium/device/current_activity');
      },
      commandName: 'appium.getCurrentActivity',
      args: []
    });
  });

  it('testGetCurrentPackage', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.path, '/session/1352110219202/appium/device/current_package');
      },
      commandName: 'appium.getCurrentPackage',
      args: []
    });
  });
});
