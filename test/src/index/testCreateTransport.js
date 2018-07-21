const assert = require('assert');
const common = require('../../common.js');
const Selenium2 = common.require('transport/selenium2.js');
const WebDriver = common.require('transport/webdriver.js');
const JsonWire = common.require('transport/jsonwire.js');
const Selenium3 = common.require('transport/selenium3.js');

describe('Transport.create()', function () {
  it('test create Transport for Selenium3 external with Firefox', function() {
    const Transport = common.require('transport/transport.js');

    let seleniumExternal = Transport.create({
      settings: {
        selenium: {
          start_process: false
        },
        webdriver: {},
        desiredCapabilities: {
          browserName: 'firefox'
        }
      }
    });

    assert.ok(seleniumExternal instanceof Selenium3);
  });

  it('test create Transport for Selenium3 external with Chrome', function() {
    const Transport = common.require('transport/transport.js');

    let seleniumExternal = Transport.create({
      settings: {
        selenium: {
          start_process: false
        },
        webdriver: {

        },
        desiredCapabilities: {
          browserName: 'chrome'
        }
      }
    });

    assert.ok(seleniumExternal instanceof Selenium2);
  });

  it('test create Transport for Selenium2 external', function() {
    const Transport = common.require('transport/transport.js');

    let seleniumExternal = Transport.create({
      settings: {
        selenium: {
          start_process: false
        },
        webdriver: {

        },
        desiredCapabilities: {
          browserName: 'chrome'
        }
      }
    });

    assert.ok(seleniumExternal instanceof Selenium2);
  });

  it('test create Transport for Selenium2 managed', function() {
    const Transport = common.require('transport/transport.js');

    let seleniumExternal = Transport.create({
      settings: {
        selenium: {
          start_process: true
        },
        webdriver: {
          start_process: false
        },
        desiredCapabilities: {
          browserName: 'firefox'
        }
      }
    });

    assert.ok(seleniumExternal instanceof Selenium2);
  });

  it('test create Transport for Selenium2 managed explicit version2 setting', function() {
    const Transport = common.require('transport/transport.js');

    let seleniumExternal = Transport.create({
      settings: {
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
      }
    });

    assert.ok(seleniumExternal instanceof Selenium2);
  });

  it('test create Transport for Firefox managed', function() {
    const Transport = common.require('transport/transport.js');

    let geckoDriver = Transport.create({
      settings: {
        selenium: {
          start_process: false
        },
        webdriver: {
          start_process: true
        },
        desiredCapabilities: {
          browserName: 'firefox'
        }
      }
    });

    assert.ok(geckoDriver instanceof WebDriver);
    assert.strictEqual(geckoDriver instanceof Selenium2, false);
    assert.strictEqual(geckoDriver instanceof Selenium3, false);
    assert.strictEqual(geckoDriver instanceof JsonWire, false);
  });

  it('test create Transport for Chrome managed', function() {
    const Transport = common.require('transport/transport.js');

    let chromeDriver = Transport.create({
      settings: {
        selenium: {
          start_process: false
        },
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

  it('test create Transport for Selenium3 managed', function() {
    const Transport = common.require('transport/transport.js');

    let seleniumExternal = Transport.create({
      settings: {
        selenium: {
          start_process: true
        },
        webdriver: {
          start_process: false
        },
        desiredCapabilities: {
          browserName: 'firefox'
        }
      }
    });

    assert.ok(seleniumExternal instanceof Selenium2);
  });

  it('test create Transport for WebDriver managed and no selenium settings', function() {
    const Transport = common.require('transport/transport.js');

    let chromeDriver = Transport.create({
      settings: {
        webdriver: {
          start_process: true
        },
        desiredCapabilities: {
          browserName: 'safari'
        }
      }
    });

    assert.ok(chromeDriver instanceof JsonWire);
    assert.strictEqual(chromeDriver instanceof Selenium2, false);
    assert.strictEqual(chromeDriver instanceof Selenium3, false);
    assert.strictEqual(chromeDriver instanceof WebDriver, false);
  });

});