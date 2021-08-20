const assert = require('assert');

const Globals = require('../../../lib/globals.js');

describe('Chrome API commands', function () {
  before(function () {
    Globals.protocolBefore();
  });

  it('testLaunchApp', function () {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.strictEqual(opts.command, 'launchApp');
      },
      commandName: 'chrome.launchApp',
      args: ['1'],
      browserDriver: 'chrome'
    }).then((result) => {
      assert.deepStrictEqual(result.value, null);
    }).catch((err) => {
      throw err;
    });
  });

  it('getNetworkConditions', function() {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.strictEqual(opts.command, 'getNetworkConditions');
      },
      commandName: 'chrome.getNetworkConditions',
      args: [],
      browserDriver: 'chrome'
    }).then((result) => {
      assert.deepStrictEqual(result.value, {
        download_throughput: 460800,
        latency: 50000,
        offline: false,
        upload_throughput: 153600
      });
    }).catch((err) => {
      throw err;
    });;
  });

  it('setNetworkConditions', function() {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.strictEqual(opts.command, 'setNetworkConditions');
      },
      commandName: 'chrome.setNetworkConditions',
      args: [
        {
          offline: false,
          latency: 50000,
          download_throughput: 450 * 1024,
          upload_throughput: 150 * 1024
        }
      ],
      browserDriver: 'chrome'
    }).then((result) => {
      assert.deepStrictEqual(result.value, null);
    }).catch((err) => {
      throw err;
    });
  });

  it('sendDevToolsCommand', function() {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.strictEqual(opts.command, 'sendDevToolsCommand');
        assert.strictEqual(opts.cmd, 'Browser.getVersion');
        assert.deepStrictEqual(opts.params, {});
      },
      commandName: 'chrome.sendDevToolsCommand',
      args: ['Browser.getVersion', {}],
      browserDriver: 'chrome'
    }).then((result) => {
      assert.deepStrictEqual(result.value, null);
    }).catch((err) => {
      throw err;
    });
  });
  it('sendAndGetDevToolsCommand', function() {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.strictEqual(opts.command, 'sendAndGetDevToolsCommand');
        assert.strictEqual(opts.cmd, 'Browser.getVersion');
        assert.deepStrictEqual(opts.params, {});
      },
      commandName: 'chrome.sendAndGetDevToolsCommand',
      args: ['Browser.getVersion', {}],
      browserDriver: 'chrome'
    })
      .then((result) => {
        assert.deepStrictEqual(
          result.value.userAgent,
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
        );
        assert.deepStrictEqual(result.value.product, 'Chrome/92.0.4515.159');
      })
      .catch((err) => {
        throw err;
      });
  });
  it('setDownloadPath', function() {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.strictEqual(opts.command, 'setDownloadPath');
        assert.strictEqual(opts.cmd, 'Browser.getVersion');
        assert.deepStrictEqual(opts.params, {});
      },
      commandName: 'chrome.setDownloadPath',
      args: ['/path/to/downloadFolder'],
      browserDriver: 'chrome'
    })
      .then((result) => {
        assert.deepStrictEqual(result.value, null);
      })
      .catch((err) => {
        throw err;
      });
  });
});
