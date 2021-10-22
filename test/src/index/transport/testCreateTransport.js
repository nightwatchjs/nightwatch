const assert = require('assert');
const common = require('../../../common.js');
const NightwatchClient = common.require('index.js');
const SeleniumRemote = common.require('transport/selenium-webdriver/selenium.js');
const GeckoDriver = common.require('transport/selenium-webdriver/firefox.js');
const ChromeDriver = common.require('transport/selenium-webdriver/chrome.js');
const EdgeDriver = common.require('transport/selenium-webdriver/edge.js');
const SafariDriver = common.require('transport/selenium-webdriver/safari.js');

describe('Transport.create()', function () {
  it('test create Transport for Selenium external with Firefox', function() {
    const client = NightwatchClient.client({
      selenium: {
        start_process: false
      },
      webdriver: {},
      desiredCapabilities: {
        browserName: 'firefox'
      },
      selenium_host: 'remote.url'
    });

    assert.ok(client.transport instanceof SeleniumRemote);
    assert.strictEqual(client.settings.webdriver.host, 'remote.url');
  });

  it('test create Transport for Selenium external with Firefox - seleniumHost property', function() {
    const client = NightwatchClient.client({
      selenium: {
        start_process: false
      },
      webdriver: {},
      desiredCapabilities: {
        browserName: 'firefox'
      },
      seleniumHost: 'remote.url'
    });

    assert.ok(client.transport instanceof SeleniumRemote);
    assert.strictEqual(client.settings.webdriver.host, 'remote.url');
  });

  it('test create Transport for Webdriver external - host property', function() {
    const client = NightwatchClient.client({
      webdriver: {
        host: 'remote.url'
      },
      desiredCapabilities: {
        browserName: 'firefox'
      }
    });

    assert.ok(client.transport instanceof GeckoDriver);
    assert.strictEqual(client.settings.webdriver.host, 'remote.url');
  });

  it('test create Transport for Selenium external with Chrome', function() {
    const client = NightwatchClient.client({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      selenium_host: 'remote.url'
    });

    assert.ok(client.transport instanceof SeleniumRemote);
    assert.strictEqual(client.settings.webdriver.host, 'remote.url');
  });

  it('test create Transport for Selenium managed', function() {
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

    assert.ok(client.transport instanceof SeleniumRemote);
  });

  it('test create Transport with unknown browser', function() {
    assert.throws(function() {
      NightwatchClient.client({
        webdriver: {
          start_process: true
        },
        desiredCapabilities: {
          browserName: 'firfox'
        }
      });
    }, /Unknown browser: "firfox"; did you mean "firefox"\?$/);
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

    assert.ok(client.transport instanceof GeckoDriver);
    assert.strictEqual(client.transport instanceof SeleniumRemote, false);
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

    assert.ok(client.transport instanceof ChromeDriver);
    assert.strictEqual(client.transport instanceof SeleniumRemote, false);
    assert.deepStrictEqual(client.transport.desiredCapabilities, {
      browserName: 'chrome'
    });
  });

  it('test create Transport for Chrome managed with w3c:true', function() {
    const client = NightwatchClient.client({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          w3c: true
        }
      }
    });

    assert.ok(client.transport instanceof ChromeDriver);
    assert.strictEqual(client.transport instanceof SeleniumRemote, false);
    assert.deepStrictEqual(client.transport.desiredCapabilities, {
      browserName: 'chrome',
      'goog:chromeOptions': {
        w3c: true
      }
    });
  });

  it('test create Transport for Chrome managed with w3c:false', function() {
    const client = NightwatchClient.client({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          w3c: false
        }
      }
    });

    assert.ok(client.transport instanceof ChromeDriver);
    assert.strictEqual(client.transport instanceof SeleniumRemote, false);
    assert.deepStrictEqual(client.transport.desiredCapabilities, {
      browserName: 'chrome',
      'goog:chromeOptions': {
        w3c: false
      }
    });
  });

  it('test create Transport for Edge managed with w3c:true', function() {
    const client = NightwatchClient.client({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'MicrosoftEdge',
        'ms:edgeOptions': {
          w3c: true
        }
      }
    });

    assert.ok(client.transport instanceof EdgeDriver);
    assert.strictEqual(client.transport instanceof SeleniumRemote, false);
    assert.deepStrictEqual(client.transport.desiredCapabilities, {
      browserName: 'MicrosoftEdge',
      'ms:edgeOptions': {
        w3c: true
      }
    });
  });

  it('test create Transport for Edge managed', function() {
    const client = NightwatchClient.client({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'MicrosoftEdge'
      }
    });

    assert.ok(client.transport instanceof EdgeDriver);
    assert.strictEqual(client.transport instanceof SeleniumRemote, false);
    assert.deepStrictEqual(client.transport.desiredCapabilities, {
      browserName: 'MicrosoftEdge'
    });
  });

  it('test create Transport for Edge managed with w3c:false', function() {
    const client = NightwatchClient.client({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'MicrosoftEdge',
        'ms:edgeOptions': {
          w3c: false
        }
      }
    });

    assert.strictEqual(client.transport instanceof SeleniumRemote, false);
    assert.strictEqual(client.transport instanceof EdgeDriver, true);
    assert.deepStrictEqual(client.transport.desiredCapabilities, {
      browserName: 'MicrosoftEdge',
      'ms:edgeOptions': {
        w3c: false
      }
    });
  });

  it('test create Transport for Safari managed', function() {
    let client = NightwatchClient.client({
      selenium: {
        start_process: false
      },
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'safari'
      }
    });

    assert.ok(client.transport instanceof SafariDriver);
    assert.strictEqual(client.transport instanceof SeleniumRemote, false);
  });

  it('test create Transport for Safari remote', function() {
    const Transport = common.require('transport/index.js');

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

    assert.ok(safariDriver instanceof SafariDriver);
    assert.strictEqual(safariDriver instanceof SeleniumRemote, false);
  });

  it('test create Transport for Chrome managed and no selenium settings', function() {
    const Transport = common.require('transport/index.js');

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

    assert.ok(chromeDriver instanceof ChromeDriver);
    assert.strictEqual(chromeDriver instanceof SeleniumRemote, false);
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

    assert.ok(client.transport instanceof SafariDriver);
    assert.strictEqual(client.transport instanceof SeleniumRemote, false);
  });

  it('test check for ssl when webdriver port is 443', function () {
    const Transport = common.require('transport/index.js');
    const Settings = common.require('settings/settings.js');

    const settings = Settings.fromClient({
      webdriver: {
        start_process: true,
        port: 443,
        host: 'remote.host'
      },
      desiredCapabilities: {
        browserName: 'chrome'
      }
    });

    const instance = {
      settings
    };

    const chromeDriver = Transport.create(instance);
    assert.strictEqual(instance.settings.webdriver.ssl, true);
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

    assert.ok(client.transport instanceof SeleniumRemote);

    const elementId = client.transport.getElementId({
      'element-6066-11e4-a52e-4f735466cecf': 'abcd-123'
    });
    assert.strictEqual(elementId, 'abcd-123');
    assert.strictEqual(client.settings.webdriver.host, 'remote.host');
    assert.strictEqual(client.settings.webdriver.default_path_prefix, '/wd/hub');
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

    assert.ok(client.transport instanceof SeleniumRemote);
    assert.strictEqual(client.settings.webdriver.host, 'remote.host');
    assert.strictEqual(client.settings.webdriver.default_path_prefix, '/wd/hub');
  });

});
