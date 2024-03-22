const assert = require('assert');
const MockServer = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

const randomImage =
      '/9j/4AAQSkZJRgABAQAASABIAAD/4QBqRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAABJKGAAcAAAASAAAAUKABAAMAAAABAAEAAKACAAQAAAABAAABAKADAAQAAAABAAABAAAAAABBU0NJSQAAADEuMTUuMS0yMUj/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs';

describe('takeElementScreenshot', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.takeElementScreenshot()', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/screenshot',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value:
          randomImage
      })
    });

    this.client.api
      .takeElementScreenshot('#weblogin', function(result) {
        assert.strictEqual(result.value, randomImage);
      })
      .takeElementScreenshot('css selector', '#weblogin', function(result) {
        assert.strictEqual(result.value, randomImage);
      })
      .takeElementScreenshot('css selector', {
        selector: '#weblogin',
        timeout: 100
      }, function(result) {
        assert.strictEqual(result.value, randomImage);
      });

    this.client.start(done);
  });
});
