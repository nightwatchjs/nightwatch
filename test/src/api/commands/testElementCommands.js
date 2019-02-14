const assert = require('assert');
const nocks = require('../../../lib/nockselements.js');
const Nightwatch = require('../../../lib/nightwatch.js');
const common = require('../../../common.js');
const Logger = common.require('util/logger.js');

describe('element base commands', function() {
  before(function(done) {
    Logger.enable();
    Logger.setOutputEnabled();
    Nightwatch.startMockServer(done);
  });

  after(function(done) {
    Nightwatch.stop(done);
  });

  beforeEach(function () {
    //nocks.cleanAll();
  });

  afterEach(function(done) {
    //nocks.cleanAll();
  });

  it('client.element()', function(done) {
    //nocks.elementFound('.weblogin');


    Nightwatch.init({
      output: true,
      silent: false
    }, function() {
      Nightwatch.api()
        .element('css selector', '.weblogin', function callback(result) {
          assert.equal(result.status, 0);
        });

      Nightwatch.start(done);
    });
  });

  it('client.element() W3C Webdriver prototcol', function(done) {
    nocks
      .elementFound('.weblogin')

    Nightwatch.api().element('css selector', '.weblogin', function callback(result) {
      assert.equal(result.status, 0);
    });

    Nightwatch.start(done);
  });

  it('client.click() with xpath', function(done) {
    MockServer.addMock({
      'url' : '/wd/hub/session/1352110219202/element/0/click',
      'response' : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    this.client.api.useXpath()
      .click('//weblogin', function callback(result) {
        assert.equal(result.status, 0);
      })
      .click('css selector', '#weblogin', function callback(result) {
        assert.equal(result.status, 0);
      });

    this.client.start(done);
  });
});
