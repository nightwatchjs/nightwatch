var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('saveScreenshot', {

    'client.saveScreenshot()' : function(done) {
      var client = Nightwatch.client();
      var api = Nightwatch.api();

      MockServer.addMock({
        url : '/wd/hub/session/1352110219202/screenshot',
        method:'GET',
        response : JSON.stringify({
          sessionId: '1352110219202',
          status:0,
          value:'screendata'
        })
      });

      api.options.log_screenshot_data = false;

      client.saveScreenshotToFile = function(fileName, data, cb) {
        assert.equal(fileName, 'screenshot.png');
        assert.equal(data, 'screendata');
        cb();
      };

      api.saveScreenshot('screenshot.png', function(result) {
        assert.equal(result.value, 'screendata');
        assert.equal(result.suppressBase64Data, true);
        done();
      });

      Nightwatch.start();
    }
  });
