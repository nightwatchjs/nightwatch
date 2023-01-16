const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const common = require('../../../../common.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const {Screenshots} = common.require('utils');

describe('.saveScreenshot()', function() {
  before(function() {
    this.writeScreenshotToFile = Screenshots.writeScreenshotToFile;
  });

  after(function() {
    Screenshots.writeScreenshotToFile = this.writeScreenshotToFile;
  });

  describe('with backwards compat mode', function() {
    before(function(done) {
      CommandGlobals.beforeEach.call(this, done, {
        backwards_compatibility_mode: true
      });
    });

    after(function(done) {
      CommandGlobals.afterEach.call(this, done);
    });

    it('browser.saveScreenshot()', function(done) {
      const base64Image = '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';
      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/screenshot',
        method: 'GET',
        response: JSON.stringify({
          sessionId: '1352110219202',
          status: 0,
          value: base64Image
        })
      }, true);

      this.client.api.options.log_screenshot_data = false;

      Screenshots.writeScreenshotToFile = async function(fileName, data, cb) {
        assert.strictEqual(fileName, 'screenshot.png');
        assert.strictEqual(data, base64Image);
        
        return fileName;
      };

      this.client.api.saveScreenshot('screenshot.png', function(result) {
        assert.strictEqual(result.value, base64Image);
        assert.strictEqual(result.suppressBase64Data, true);
      });

      this.client.start(done);
    });
  });

  describe('without compat mode', function() {
    before(function(done) {
      CommandGlobals.beforeEach.call(this, done);
    });

    after(function(done) {
      CommandGlobals.afterEach.call(this, done);
    });

    it('browser.saveScreenshot()', function(done) {
      const base64Image = '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';
      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/screenshot',
        method: 'GET',
        response: JSON.stringify({
          sessionId: '1352110219202',
          status: 0,
          value: base64Image
        })
      }, true);

      this.client.api.options.log_screenshot_data = false;

      Screenshots.writeScreenshotToFile = async function(fileName, data, cb) {
        assert.strictEqual(fileName, 'screenshot.png');
        assert.strictEqual(data, base64Image);

        return fileName;
      };

      this.client.api.saveScreenshot('screenshot.png', function(result) {
        assert.strictEqual(result.value, base64Image);
        assert.strictEqual(result.suppressBase64Data, true);
      });

      this.client.start(done);
    });
  });
});
