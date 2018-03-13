const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const Nightwatch = require('../../../lib/nightwatch.js');

describe('clearValue', function() {
  beforeEach(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function(done) {
    this.server.close(function () {
      done();
    });
  });

  it('client.clearValue()', function(done) {
    Nightwatch.initClient()
      .then(client => {
        MockServer.addMock({
          'url': '/wd/hub/session/1352110219202/element/0/clear',
          'response': JSON.stringify({
            sessionId: '1352110219202',
            status: 0
          })
        });

        client.api.clearValue('#weblogin', function callback(result) {
          assert.equal(result.status, 0);
        }).clearValue('css selector', '#weblogin', function callback(result) {
          assert.equal(result.status, 0);
        });

        client.start(done);
      });
  });

  it('client.clearValue() - webdriver protocol', function(done) {
    Nightwatch.initClient({
      selenium : {
        version2: false
      }
    }).then(client => {
      MockServer.addMock({
        'url': '/wd/hub/session/1352110219202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/clear',
        'response': JSON.stringify({
          sessionId: '1352110219202',
          status: 0
        })
      });

      client.api.clearValue('#webdriver', function(result) {
        assert.equal(result.status, 0);
      }).clearValue('css selector', '#webdriver', function(result) {
        assert.equal(result.status, 0);
      });

      client.start(done);
    });
  });
});
