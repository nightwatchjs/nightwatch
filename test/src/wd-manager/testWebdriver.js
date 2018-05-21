const assert = require('assert');
const path = require('path');
const common = require('../../common.js');
const NightwatchClient = common.require('index.js');

describe('Webdriver Manager', function () {
  describe('test WebDriver', function () {
    it('test start geckodriver with concurrency', function () {

      return NightwatchClient.runTests({
        env: 'default',
        config: path.join(__dirname, '../../extra/withgeckodriver-concurrent.json')
      }, {
        output: false,
        output_folder: false
      }).catch(err => {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.showTrace, false);
        assert.ok(err.message.includes('Concurrency is not supported at the moment in GeckoDriver. It is only supported for ChromeDriver and Selenium Server.'));
      });
    });
  });
});