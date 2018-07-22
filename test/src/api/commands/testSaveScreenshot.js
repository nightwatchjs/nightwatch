const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const common = require('../../../common.js');
const CommandGlobals = require('../../../lib/globals/commands.js');
const Screenshots = common.require('testsuite/screenshots.js');

describe('saveScreenshot', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.saveScreenshot()', function(done) {
    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/screenshot',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value:'screendata'
      })
    });

    this.client.api.options.log_screenshot_data = false;

    Screenshots.writeScreenshotToFile = function(fileName, data, cb) {
      assert.equal(fileName, 'screenshot.png');
      assert.equal(data, 'screendata');
      cb();
    };

    this.client.api.saveScreenshot('screenshot.png', function(result) {
      assert.equal(result.value, 'screendata');
      assert.strictEqual(result.suppressBase64Data, true);
    });

    this.client.start(done);
  });
});
