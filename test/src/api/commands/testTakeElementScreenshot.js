const assert = require('assert');
const MockServer = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

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
          '/9j/4AAQSkZJRgABAQAASABIAAD/4QBqRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAABJKGAAcAAAASAAAAUKABAAMAAAABAAEAAKACAAQAAAABAAABAKADAAQAAAABAAABAAAAAABBU0NJSQAAADEuMTUuMS0yMUj/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs'
      })
    });

    this.client.api
      .takeElementScreenshot('#weblogin', true, function callback(result) {
        assert.strictEqual(result.value, '/9j/4AAQSkZJRgABAQAASABIAAD/4QBqRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAABJKGAAcAAAASAAAAUKABAAMAAAABAAEAAKACAAQAAAABAAABAKADAAQAAAABAAABAAAAAABBU0NJSQAAADEuMTUuMS0yMUj/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs');
      })
      .takeElementScreenshot('css selector', '#weblogin', true, function callback(result) {
        assert.strictEqual(result.value, '/9j/4AAQSkZJRgABAQAASABIAAD/4QBqRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAABJKGAAcAAAASAAAAUKABAAMAAAABAAEAAKACAAQAAAABAAABAKADAAQAAAABAAABAAAAAABBU0NJSQAAADEuMTUuMS0yMUj/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs');
      })
      .takeElementScreenshot(
        'css selector',
        {
          selector: '#weblogin',
          timeout: 100
        },
        true,
        function callback(result) {
          assert.strictEqual(result.value, '/9j/4AAQSkZJRgABAQAASABIAAD/4QBqRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAABJKGAAcAAAASAAAAUKABAAMAAAABAAEAAKACAAQAAAABAAABAKADAAQAAAABAAABAAAAAABBU0NJSQAAADEuMTUuMS0yMUj/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs');
        }
      )
      .takeElementScreenshot(
        {
          selector: '#weblogin',
          timeout: 100
        },
        true,
        function callback(result) {
          assert.strictEqual(
            result.value,
            '/9j/4AAQSkZJRgABAQAASABIAAD/4QBqRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAABJKGAAcAAAASAAAAUKABAAMAAAABAAEAAKACAAQAAAABAAABAKADAAQAAAABAAABAAAAAABBU0NJSQAAADEuMTUuMS0yMUj/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs'
          );
        }
      );

    this.client.start(done);
  });
});
