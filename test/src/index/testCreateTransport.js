const assert = require('assert');
const common = require('../../common.js');
const NightwatchClient = common.require('index.js');
const Selenium2 = common.require('transport/selenium2.js');
const WebDriver = common.require('transport/webdriver.js');
const JsonWire = common.require('transport/jsonwire.js');
const Selenium3 = common.require('transport/selenium3.js');

describe('Transport.create()', function () {
  it('test create Transport for Selenium3 external with Firefox', function() {
    const client = NightwatchClient.client({
      selenium: {
        start_process: false,
      },
      webdriver: {},
      desiredCapabilities: {
        browserName: 'firefox'
      },
      selenium_host: 'remote.url'
    });

    assert.ok(client.transport instanceof Selenium3);
    assert.equal(client.settings.webdriver.host, 'remote.url');
  });

  it('test create Transport for Selenium3 external with Firefox - seleniumHost property', function() {
    const client = NightwatchClient.client({
      selenium: {
        start_process: false,
      },
      webdriver: {},
      desiredCapabilities: {
        browserName: 'firefox'
      },
      seleniumHost: 'remote.url'
    });

    assert.ok(client.transport instanceof Selenium3);
    assert.equal(client.settings.webdriver.host, 'remote.url');
  });

  it('test create Transport for Webdriver external - host property', function() {
    const client = NightwatchClient.client({
      webdriver: {
        host: 'remote.url'
      },
      desiredCapabilities: {
        browserName: 'firefox'
      },
    });

    assert.ok(client.transport instanceof WebDriver);
    assert.equal(client.settings.webdriver.host, 'remote.url');
  });

  it('test create Transport for Selenium3 external with Chrome', function() {
    const client = NightwatchClient.client({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      selenium_host: 'remote.url'
    });

    assert.ok(client.transport instanceof Selenium2);
    assert.equal(client.settings.webdriver.host, 'remote.url');
  });

  it('test create Transport for Selenium3 managed', function() {
    const client = NightwatchClient.client({
      selenium: {
        start_process: true
      },
      webdriver: {
        start_process: false
      },
      desiredCapabilities: {
        browserName: 'firefox'
      }
    });

    assert.ok(client.transport instanceof Selenium3);
  });

  it('test create Transport for Selenium2 managed explicit version2 setting', function() {
    const client = NightwatchClient.client({
      selenium: {
        version2: true,
        start_process: true
      },
      webdriver: {
        start_process: false
      },
      desiredCapabilities: {
        browserName: 'firefox'
      }
    });

    assert.ok(client.transport instanceof Selenium2);
    assert.strictEqual(client.transport instanceof Selenium3, false);
  });

  it('test create Transport for Firefox managed', function() {
    const client = NightwatchClient.client({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'firefox'
      }
    });

    assert.ok(client.transport instanceof WebDriver);
    assert.strictEqual(client.transport instanceof Selenium2, false);
    assert.strictEqual(client.transport instanceof Selenium3, false);
    assert.strictEqual(client.transport instanceof JsonWire, false);
  });

  it('test create Transport for Chrome managed', function() {
    const client = NightwatchClient.client({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'chrome'
      }
    });

    assert.ok(client.transport instanceof JsonWire);
    assert.strictEqual(client.transport instanceof Selenium2, false);
    assert.strictEqual(client.transport instanceof Selenium3, false);
    assert.strictEqual(client.transport instanceof WebDriver, false);
  });

  it('test create Transport for Safari managed', function() {
    const Transport = common.require('transport/transport.js');

    let safariDriver = Transport.create({
      settings: {
        selenium: {
          start_process: false
        },
        webdriver: {
          start_process: true
        },
        desiredCapabilities: {
          browserName: 'safari'
        }
      }
    });

    assert.ok(safariDriver instanceof WebDriver);
  });

  it('test create Transport for Safari remote', function() {
    const Transport = common.require('transport/transport.js');

    let safariDriver = Transport.create({
      settings: {
        selenium: {
          start_process: false
        },
        webdriver: {
          start_process: false,
          host: 'remote.url'
        },
        desiredCapabilities: {
          browserName: 'safari'
        }
      }
    });

    assert.ok(safariDriver instanceof JsonWire);
    assert.strictEqual(safariDriver instanceof Selenium2, false);
    assert.strictEqual(safariDriver instanceof Selenium3, false);
    assert.strictEqual(safariDriver instanceof WebDriver, false);
  });

  it('test create Transport for Chrome managed and no selenium settings', function() {
    const Transport = common.require('transport/transport.js');

    let chromeDriver = Transport.create({
      settings: {
        webdriver: {
          start_process: true
        },
        desiredCapabilities: {
          browserName: 'chrome'
        }
      }
    });

    assert.ok(chromeDriver instanceof JsonWire);
    assert.strictEqual(chromeDriver instanceof Selenium2, false);
    assert.strictEqual(chromeDriver instanceof Selenium3, false);
    assert.strictEqual(chromeDriver instanceof WebDriver, false);
  });

  it('test create Transport for WebDriver managed and no selenium settings', function() {
    const client = NightwatchClient.client({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'safari'
      }
    });

    assert.ok(client.transport instanceof WebDriver);
    assert.strictEqual(client.transport instanceof Selenium2, false);
    assert.strictEqual(client.transport instanceof Selenium3, false);
  });

  it('test create Transport for Selenium remote cloud service with Chrome', function() {
    const client = NightwatchClient.client({
      selenium: {
        start_process: false
      },
      desiredCapabilities: {
        browserName: 'Chrome'
      },
      selenium_host: 'remote.host'
    });

    assert.ok(client.transport instanceof Selenium2);
    assert.equal(client.settings.webdriver.host, 'remote.host');
    assert.equal(client.settings.webdriver.default_path_prefix, '/wd/hub');
  });

  it('test create Transport for Selenium remote cloud service with MicrosoftEdge', function() {
    const client = NightwatchClient.client({
      selenium: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'MicrosoftEdge'
      },
      selenium_host: 'remote.host'
    });

    assert.ok(client.transport instanceof Selenium2);
    assert.equal(client.settings.webdriver.host, 'remote.host');
    assert.equal(client.settings.webdriver.default_path_prefix, '/wd/hub');
    assert.strictEqual(client.transport instanceof Selenium3, false);
  });

});
