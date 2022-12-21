const assert = require('assert');
const common = require('../../../../common.js');
const Nocks = require('../../../../lib/nocks');
const Utils = common.require('utils');
const CommandGlobals = require('../../../../lib/globals/commands');

describe('.saveSnapshot()', function() {
  before(function(done) {
    this.writetToFile = Utils.writeToFile;
    CommandGlobals.beforeEach.call(this, done);
  });

  this.beforeEach(function() {
    Nocks.enable();
    Nocks.cleanAll();
  });

  after(function(done) {
    Utils.writeToFile = this.writeToFile;
    Nocks.disable();
    CommandGlobals.afterEach.call(this, done);
  });

  it('browser.saveScreenshot()', function(done) {
    const pageHtml = '<!doctype html><html class="no-js" lang=""><head> <meta charset="utf-8"> <title></title> <meta name="description" content=""> <meta name="viewport" content="width=device-width, initial-scale=1"> <meta property="og:title" content=""> <meta property="og:type" content=""> <meta property="og:url" content=""> <meta property="og:image" content=""> <link rel="manifest" href="site.webmanifest"> <link rel="apple-touch-icon" href="icon.png"> <link rel="stylesheet" href="css/normalize.css"> <link rel="stylesheet" href="css/main.css"> <meta name="theme-color" content="#fafafa"></head><body> <p>Hello world! This is HTML5 Boilerplate.</p><script src="js/vendor/modernizr-3.11.2.min.js"></script> <script src="js/plugins.js"></script> <script src="js/main.js"></script> <script>window.ga=function (){ga.q.push(arguments)}; ga.q=[]; ga.l=+new Date; ga(\'create\', \'UA-XXXXX-Y\', \'auto\'); ga(\'set\', \'anonymizeIp\', true); ga(\'set\', \'transport\', \'beacon\'); ga(\'send\', \'pageview\') </script> <script src="https://www.google-analytics.com/analytics.js" async></script></body></html>';
    const pageHtmlWithoutScript = '<!DOCTYPE html><html class="no-js" lang=""><head> <meta charset="utf-8"> <title></title> <meta name="description" content=""> <meta name="viewport" content="width=device-width, initial-scale=1"> <meta property="og:title" content=""> <meta property="og:type" content=""> <meta property="og:url" content=""> <meta property="og:image" content=""> <link rel="manifest" href="site.webmanifest"> <link rel="apple-touch-icon" href="icon.png"> <link rel="stylesheet" href="css/normalize.css"> <link rel="stylesheet" href="css/main.css"> <meta name="theme-color" content="#fafafa"></head><body> <p>Hello world! This is HTML5 Boilerplate.</p>    </body></html>'
    const pageUrl = 'https://nightwatchjs.org';

    Nocks.getUrl(pageUrl);
    Nocks.getPageSource(pageHtml);

    Utils.writeToFile = async function(fileName, data) {
      assert.strictEqual(fileName, 'snpashot.html');
      assert.strictEqual(data, pageHtmlWithoutScript);

      return fileName;
    };

    this.client.api.saveSnapshot('snpashot.html', function(result) {
      assert.ok(result);
      assert.deepStrictEqual(result, {snapshotFilePath: 'snpashot.html',
        snapshotUrl: pageUrl});
    });

    this.client.start(done);
  });
});
