const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('uploadFile', function() {

  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.uploadFile()', function(done) {
    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/value',
      method:'POST',
      postdata : {value:[ 
        '/', 'f', 'i', 'l', 'e', '.', 'j', 's'
      ]},
      response : {
        sessionId: '1352110219202',
        status:0
      }
    });

    this.client.api
      .setPassword('css selector', '#choosefile', '/file.js', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .setPassword('css selector', {
        selector: '#choosefile',
        timeout: 100
      }, '/file.js', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .setPassword({
        selector: '#choosefile',
        timeout: 100
      }, '/file.js', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .setPassword('#choosefile', '/file.js', function callback(result) {
        assert.strictEqual(result.status, 0);
      });

    this.client.start(done);
  });
});
