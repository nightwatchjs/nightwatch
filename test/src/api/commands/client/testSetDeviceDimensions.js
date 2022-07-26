const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const MockServer = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');
const cdp = require('../../../../../lib/transport/selenium-webdriver/cdp.js');

describe('.setDeviceDimensions()', function () {
  beforeEach(function (done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('should set device dimensions when all four properties are provided', function (done) {

    MockServer.addMock({
      url: '/session',
      response: {
        value: {
          sessionId: '13521-10219-202',
          capabilities: {
            browserName: 'chrome',
            browserVersion: '92.0'
          }
        }
      },
      method: 'POST',
      statusCode: 201
    }, true);

    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {}
      },
      output: process.env.VERBOSE === '1',
      silent: false
    }).then(client => {
      const expected = {};

      cdp.resetConnection();
      client.transport.driver.createCDPConnection = function() {
        return Promise.resolve({
          execute: function(command, metrics) {
            expected['cdpCommand'] = command;
            expected['width'] = metrics.width;
            expected['height'] = metrics.height;
            expected['deviceScaleFactor'] = metrics.deviceScaleFactor;
            expected['mobile'] = metrics.mobile;
          }
        });
      };
      client.api.setDeviceDimensions({width: 400, height: 600, deviceScaleFactor: 50, mobile: true}, function (){
        assert.strictEqual(expected.cdpCommand, 'Emulation.setDeviceMetricsOverride');
        assert.strictEqual(expected.width, 400);
        assert.strictEqual(expected.height, 600);
        assert.strictEqual(expected.deviceScaleFactor, 50);
        assert.strictEqual(expected.mobile, true);
      });
      client.start(done);
    });
  });

  it('should set device dimensions when just any two properties are provided', function (done) {

    MockServer.addMock({
      url: '/session',
      response: {
        value: {
          sessionId: '13521-10219-202',
          capabilities: {
            browserName: 'chrome',
            browserVersion: '92.0'
          }
        }
      },
      method: 'POST',
      statusCode: 201
    }, true);

    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {}
      },
      output: process.env.VERBOSE === '1',
      silent: false
    }).then(client => {
      const expected = {};

      cdp.resetConnection();
      client.transport.driver.createCDPConnection = function() {
        return Promise.resolve({
          execute: function(command, metrics) {
            expected['cdpCommand'] = command;
            expected['width'] = metrics.width;
            expected['height'] = metrics.height;
            expected['deviceScaleFactor'] = metrics.deviceScaleFactor;
            expected['mobile'] = metrics.mobile;
          }
        });
      };
      client.api.setDeviceDimensions({width: 400, deviceScaleFactor: 100}, function (){
        assert.strictEqual(expected.cdpCommand, 'Emulation.setDeviceMetricsOverride');
        assert.strictEqual(expected.width, 400);
        assert.strictEqual(expected.height, 0);
        assert.strictEqual(expected.deviceScaleFactor, 100);
        assert.strictEqual(expected.mobile, false);
      });
      client.start(done);
    });
  });

  it('should clear the device dimensions override when no property is provided', function (done) {

    MockServer.addMock({
      url: '/session',
      response: {
        value: {
          sessionId: '13521-10219-202',
          capabilities: {
            browserName: 'chrome',
            browserVersion: '92.0'
          }
        }
      },
      method: 'POST',
      statusCode: 201
    }, true);

    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {}
      },
      output: process.env.VERBOSE === '1',
      silent: false
    }).then(client => {
      const expected = {};

      cdp.resetConnection();
      client.transport.driver.createCDPConnection = function() {
        return Promise.resolve({
          execute: function(command, metrics) {
            expected['cdpCommand'] = command;
            expected['metrics'] = metrics;
          }
        });
      };

      client.api.setDeviceDimensions({}, function () {
        assert.strictEqual(expected.cdpCommand, 'Emulation.setDeviceMetricsOverride');
        assert.deepEqual(expected.metrics, {deviceScaleFactor: 0, height: 0, mobile: false, width: 0});
      });

      // Checks if setDeviceDimensions work (doesn't throw error) with not argument at all.
      client.api.setDeviceDimensions();

      client.start(done);
    });
  });

  it('browser.setDeviceDimensions - driver not supported', function(done){
    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'firefox'
      },
      output: process.env.VERBOSE === '1',
      silent: false
    }).then(client => {
      client.api.setDeviceDimensions({width: 400, height: 600, deviceScaleFactor: 50}, function(result){
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'The command .setDeviceDimensions() is only supported in Chrome and Edge drivers');
      });
      client.start(done);
    });
  });

}); 