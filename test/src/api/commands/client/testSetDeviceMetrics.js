const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const MockServer = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');

describe('.setDeviceMetrics()', function () {
  beforeEach(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  // Should set device metrics when all four properties are provided.
  it('browser.setDeviceMetrics({width, height, deviceScaleFactor, mobile})', function (done) {

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
      }
    }).then(client => {

      let expectedCDPCommand;
      let expectedWidth;
      let expectedHeight;
      let expectedDeviceScaleFactor;
      let expectedMobile;

      client.transport.driver.createCDPConnection = function() {
        return Promise.resolve({
          execute: function(command, metrics) {
            expectedCDPCommand = command;
            expectedWidth = metrics.width;
            expectedHeight = metrics.height;
            expectedDeviceScaleFactor = metrics.deviceScaleFactor;
            expectedMobile = metrics.mobile;
          }
        });
      };
      client.api.setDeviceMetrics({width: 400, height: 600, deviceScaleFactor: 50, mobile: true}, function (){
        assert.strictEqual(expectedCDPCommand, 'Emulation.setDeviceMetricsOverride');
        assert.strictEqual(expectedWidth, 400);
        assert.strictEqual(expectedHeight, 600);
        assert.strictEqual(expectedDeviceScaleFactor, 50);
        assert.strictEqual(expectedMobile, true);
      });
      client.start(done);
    });
  });

  // Should set device metrics when just two properties are provided.
  it('browser.setDeviceMetrics({width, height})', function (done) {

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
      }
    }).then(client => {

      let expectedCDPCommand;
      let expectedWidth;
      let expectedHeight;
      let expectedDeviceScaleFactor;
      let expectedMobile;

      client.transport.driver.createCDPConnection = function() {
        return Promise.resolve({
          execute: function(command, metrics) {
            expectedCDPCommand = command;
            expectedWidth = metrics.width;
            expectedHeight = metrics.height;
            expectedDeviceScaleFactor = metrics.deviceScaleFactor;
            expectedMobile = metrics.mobile;
          }
        });
      };
      client.api.setDeviceMetrics({width: 400, deviceScaleFactor: 100}, function (){
        assert.strictEqual(expectedCDPCommand, 'Emulation.setDeviceMetricsOverride');
        assert.strictEqual(expectedWidth, 400);
        assert.strictEqual(expectedHeight, 0);
        assert.strictEqual(expectedDeviceScaleFactor, 100);
        assert.strictEqual(expectedMobile, false);
      });
      client.start(done);
    });
  });

  // Should clear the device metrics override when no property is provided.
  it('browser.setDeviceMetrics()', function (done) {

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
      }
    }).then(client => {

      let expectedCDPCommand;
      let expectedMetrics;

      client.transport.driver.createCDPConnection = function() {
        return Promise.resolve({
          execute: function(command, metrics) {
            expectedCDPCommand = command;
            expectedMetrics = metrics;
          }
        });
      };

      client.api.setDeviceMetrics({}, function () {
        assert.strictEqual(expectedCDPCommand, 'Emulation.setDeviceMetricsOverride');
        assert.deepEqual(expectedMetrics, {deviceScaleFactor: 0, height: 0, mobile: false, width: 0});
      });

      // Checks if setDeviceMetrics works (doesn't throw error) with not argument at all.
      client.api.setDeviceMetrics();

      client.start(done);
    });
  });

  it('browser.setDeviceMetrics - driver not supported', function(done){
    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'firefox'
      }
    }).then(client => {
      client.api.setDeviceMetrics({width: 400, height: 600, deviceScaleFactor: 50}, function(result){
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'SetDeviceMetrics is not supported while using this driver');
      });
      client.start(done);
    });
  });

}); 