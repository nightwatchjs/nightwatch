const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const MockServer = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');

describe('.setGeolocation()', function () {
  beforeEach(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  // Should mock geolocation when all three parameters are provided.
  it('browser.setGeolocation({latitude, longitude, accuracy})', function (done) {

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
      const expected = {};

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

  // Should mock geolocation when just latitude and longitude is provided (accuracy default to 100)
  it('browser.setGeolocation({latitude, longitude})', function (done) {

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
      const expected = {};

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

  // Should throw an error when just either of latitude and longitude are provided.
  it('browser.setGeolocation({longitude})', function (done) {

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
      client.api.setGeolocation({longitude: 139.691706}, function (result){
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'Please provide both latitude and longitude while using setGeolocation.');
      });
      client.start(done);
    });
  });

  // Should clear the geolocation override
  it('browser.setGeolocation()', function (done) {

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
      const expected = {};

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
      }
    }).then(client => {
      client.api.setGeolocation({latitude: 35.689487, longitude: 139.691706, accuracy: 55}, function(result){
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'SetGeolocation is not supported while using this driver');
      });
      client.start(done);
    });
  });

});