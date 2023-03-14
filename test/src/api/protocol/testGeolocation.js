const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('Geolocation commands', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testSetGeolocation with correct options', function() {
    const coordinates = {latitude: 35.689487, longitude: 139.691706, altitude: 5};

    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/location');
        assert.deepStrictEqual(opts.data, {
          location: {latitude: 35.689487, longitude: 139.691706, altitude: 5}
        });
      },
      commandName: 'appium.setGeolocation',
      args: [coordinates]
    });
  });

  it('testSetGeolocation with incorrect options', function() {
    const coordinates = {latitude: 35.689487};

    return Globals.protocolTest({
      commandName: 'appium.setGeolocation',
      args: [coordinates]
    }).catch(err => {
      return err;
    }).then((result) => {
      assert.ok(result instanceof Error);
      assert.strictEqual(result.message.includes('Please provide both latitude and longitude while using setGeolocation.'), true);
    });
  });

  it('testSetGeolocation with no options', function() {
    return Globals.protocolTest({
      commandName: 'appium.setGeolocation',
      args: []
    }).catch(err => {
      return err;
    }).then((result) => {
      assert.ok(result instanceof Error);
      assert.strictEqual(result.message.includes('Please provide both latitude and longitude while using setGeolocation.'), true);
    });
  });

  it('testGetGeolocation', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.path, '/session/1352110219202/location');
      },
      commandName: 'appium.getGeolocation',
      args: []
    });
  });
});
