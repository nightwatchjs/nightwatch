const path = require('path');
const assert = require('assert');
const nocks = require('../../lib/nockselements.js');
const Nocks = require('../../lib/nocks.js');
const Nightwatch = require('../../lib/nightwatch.js');

describe('test commands element selectors', function() {
  after(function(done) {
    nocks.disable();
    nocks.cleanAll();
    done();
  });

  before(function (done) {
    nocks.enable();
    done();
  });

  beforeEach(function (done) {
    nocks.cleanAll().createSession();
    Nightwatch.init({
      output: false,
      silent: false,
      globals: {
        waitForConditionTimeout: 100,
        waitForConditionPollInterval: 10
      },
      page_objects_path: [path.join(__dirname, '../../extra/pageobjects/pages')]
    }, done);
  });

  // wrapped selenium command

  it('getText(<various>)', function(done) {
    nocks
      .elementsFound('#nock')
      .elementsNotFound('#nock-none')
      .elementsByXpath('//[@id="nock"]')
      .text(0, 'first')
      .text(1, 'second');

    Nightwatch.api()
      .getText('#nock', function callback(result) {
        assert.strictEqual(result.value, 'first');
      })
      .getText({selector: '#nock'}, function callback(result) {
        assert.strictEqual(result.value, 'first');
      })
      .getText({selector: '#nock', index: 1}, function callback(result) {
        assert.strictEqual(result.value, 'second');
      })
      .getText({selector: '#nock-none', timeout: 19}, function callback(result) {
        assert.strictEqual(result.status, -1);
      })
      .getText({selector: '//[@id="nock"]', locateStrategy: 'xpath'}, function callback(result) {
        assert.strictEqual(result.value, 'first');
      });

    Nightwatch.start(done);
  });

  it('getText(<various>) locateStrategy', function(done) {
    nocks
      .elementsFound('#nock')
      .elementsByXpath('//[@id="nock"]')
      .text(0, 'first')
      .text(1, 'second');

    Nightwatch.api()
      .useCss()
      .getText('#nock', function callback(result) {
        assert.strictEqual(result.value, 'first');
      })
      .useXpath()
      .getText('//[@id="nock"]', function callback(result) {
        assert.strictEqual(result.value, 'first');
      })
      .useCss()
      .getText({selector: '//[@id="nock"]', locateStrategy: 'xpath'}, function callback(result) {
        assert.strictEqual(result.value, 'first');
      })
      .getText({selector: '//[@id="nock"]', locateStrategy: 'xpath', index: 1}, function callback(result) {
        assert.strictEqual(result.value, 'second');
      })
      .getText('#nock', function callback(result) {
        assert.strictEqual(result.value, 'first');
      })
      .getText('css selector', {selector: '//[@id="nock"]', locateStrategy: 'xpath'}, function callback(result) {
        assert.strictEqual(result.value, 'first');
      })
      .getText('xpath', {selector: '//[@id="nock"]'}, function callback(result) {
        assert.strictEqual(result.value, 'first');
      });

    Nightwatch.start(done);
  });

  it('waitForElementPresent(<various>)', function(done) {
    nocks.elementsFound();

    Nightwatch.api()
      .waitForElementPresent('.nock', 1, false, function callback(result) {
        assert.strictEqual(result.value.length, 1);
      })
      .waitForElementPresent({selector: '.nock'}, 1, false, function callback(result) {
        assert.strictEqual(result.value.length, 1);
      });

    Nightwatch.start(done);
  });

  it('waitForElementPresent(<string>) failure', function(done) {
    nocks.elementsNotFound();

    Nightwatch.api()
      .waitForElementPresent('.nock-none', 1, false, function callback(result) {
        assert.strictEqual(result.value, null, 'waitforPresent result expected null');
      });

    Nightwatch.start(function(err) {
      if (err && err.name !== 'NightwatchAssertError') {
        done(err);
      } else {
        done();
      }
    });
  });

  it('waitForElementPresent(<{selector}>) failure', function(done) {
    nocks.elementsNotFound();

    Nightwatch.api()
      .waitForElementPresent({selector: '.nock-none'}, 1, false, function callback(result) {
        assert.strictEqual(result.value, null, 'waitforPresent selector property result expected false');
      });

    Nightwatch.start(function(err) {
      if (err && err.name !== 'NightwatchAssertError') {
        done(err);
      } else {
        done();
      }
    });
  });

  it('waitForElementPresent(<various>) locateStrategy', function(done) {
    nocks
      .elementsFound()
      .elementsNotFound()
      .elementsByXpath();

    Nightwatch.api()
      .useCss()
      .waitForElementPresent('.nock', 1, false, function callback(result) {
        assert.strictEqual(result.value.length, 1, 'waitforPresent using css');
      })
      .useXpath()
      .waitForElementPresent('//[@class="nock"]', 1, false, function callback(result) {
        assert.strictEqual(result.value.length, 1, 'waitforPresent using xpath');
      })
      .useCss()
      .waitForElementPresent({selector: '//[@class="nock"]', locateStrategy: 'xpath'}, 1, false, function callback(result) {
        assert.strictEqual(result.value.length, 1, 'waitforPresent locateStrategy override to xpath found');
      });

    Nightwatch.start(done);
  });

  it('waitForElementNotPresent(<{selector}>) success', function(done) {
    Nocks
      .elementsFound('.nock-string')
      .elementsNotFound('.nock-string')
      .elementsFound('.nock-object')
      .elementsNotFound('.nock-object');

    Nightwatch.api()
      .waitForElementNotPresent('.nock-string', 150, false, function callback(result) {
        assert.strictEqual(result.status, -1, 'waitForElementNotPresent succeeds');
        assert.strictEqual(result.value, null, 'waitForElementNotPresent returns no elements');
      })
      .waitForElementNotPresent({selector: '.nock-object', timeout: 50, retryInterval: 20, abortOnFailure: false}, function callback(result) {
        assert.strictEqual(result.status, -1, 'waitForElementNotPresent succeeds');
        assert.strictEqual(result.value, null, 'waitForElementNotPresent returns no elements');
      });

    Nightwatch.start(function(err) {
      if (err && err.name !== 'NightwatchAssertError') {
        done(err);
      } else {
        done();
      }
    });
  });

  it('waitForElementNotPresent(<{selector}>) failure', function(done) {
    nocks
      .elementsFound('.nock-string')
      .elementsFound('.nock-object');

    Nightwatch.api()
      .waitForElementNotPresent('.nock-string', 50, 20, false, function callback(result) {
        assert.strictEqual(result.status, 0, 'waitForElementNotPresent "succeeds"');
        assert.strictEqual(result.value.length, 1, 'waitForElementNotPresent returns the found elements');
      })
      .waitForElementNotPresent({selector: '.nock-object', timeout: 50, retryInterval: 20, abortOnFailure: false}, function callback(result) {
        assert.strictEqual(result.status, 0, 'waitForElementNotPresent "succeeds"');
        assert.strictEqual(result.value.length, 1, 'waitForElementNotPresent returns the found elements');
      });

    Nightwatch.start(function(err) {
      if (err && err.name !== 'NightwatchAssertError') {
        done(err);
      } else {
        done();
      }
    });
  });
});
