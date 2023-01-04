const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const MockServer = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');
const cdp = require('../../../../../lib/transport/selenium-webdriver/cdp.js');

describe('.setGeolocation()', function () {
  beforeEach(function (done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('should mock geolocation when all three parameters are provided.', function (done) {

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
          execute: function(command, coordinates) {
            expected['cdpCommand'] = command;
            expected['latitude'] = coordinates.latitude;
            expected['longitude'] = coordinates.longitude;
            expected['accuracy'] = coordinates.accuracy;
          }
        });
      };
      client.api.setGeolocation({latitude: 35.689487, longitude: 139.691706, accuracy: 55}, function (){
        assert.strictEqual(expected.cdpCommand, 'Emulation.setGeolocationOverride');
        assert.strictEqual(expected.latitude, 35.689487);
        assert.strictEqual(expected.longitude, 139.691706);
        assert.strictEqual(expected.accuracy, 55);
      });
      client.start(done);
    });
  });

  it('should mock geolocation when just latitude and longitude is provided (accuracy default to 100)', function (done) {

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
          execute: function(command, coordinates) {
            expected['cdpCommand'] = command;
            expected['latitude'] = coordinates.latitude;
            expected['longitude'] = coordinates.longitude;
            expected['accuracy'] = coordinates.accuracy;
          }
        });
      };
      client.api.setGeolocation({latitude: 35.689487, longitude: 139.691706}, function (){
        assert.strictEqual(expected.cdpCommand, 'Emulation.setGeolocationOverride');
        assert.strictEqual(expected.latitude, 35.689487);
        assert.strictEqual(expected.longitude, 139.691706);
        assert.strictEqual(expected.accuracy, 100);
      });
      client.start(done);
    });
  });

  it('should throw an error when just either of latitude and longitude are provided', function (done) {

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
      client.api.setGeolocation({longitude: 139.691706}, function (result){
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'Please provide both latitude and longitude while using setGeolocation.');
      });
      client.start(done);
    });
  });

  it('should clear the geolocation override', function (done) {

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
          execute: function(command, coordinates) {
            expected['cdpCommand'] = command;
            expected['coordinates'] = coordinates;
          }
        });
      };

      client.api.setGeolocation({}, function (){
        assert.strictEqual(expected.cdpCommand, 'Emulation.clearGeolocationOverride');
        assert.deepEqual(expected.coordinates, {});
      });

      client.api.setGeolocation({accuracy: 50}, function (){
        assert.strictEqual(expected.cdpCommand, 'Emulation.clearGeolocationOverride');
        assert.deepEqual(expected.coordinates, {});
      });

      // Checks if setGeolocation works (doesn't throw error) with not argument at all.
      client.api.setGeolocation();

      client.start(done);
    });
  });

  it('browser.setGeolocation - driver not supported', function(done){
    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'firefox'
      },
      output: process.env.VERBOSE === '1',
      silent: false
    }).then(client => {
      client.api.setGeolocation({latitude: 35.689487, longitude: 139.691706, accuracy: 55}, function(result){
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'The command .setGeolocation() is only supported in Chrome and Edge drivers');
      });
      client.start(done);
    });
  });
});
