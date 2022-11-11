const path = require('path');
const assert = require('assert');
const nocks = require('../../lib/nockselements.js');
const Nightwatch = require('../../lib/nightwatch.js');
const {strictEqual} = assert;

describe('test page object element selectors with locateStrategy from nightwatch settings', function () {
  before(function() {
    nocks.enable();
  });

  after(function() {
    nocks.disable();
  });

  beforeEach(function(done) {
    nocks.cleanAll().enable().createSession();
    done();
  });

  it('page object allows shorthand selector for xpath when "use_xpath=true"', async function () {
    await Nightwatch.init({
      page_objects_path: [path.join(__dirname, '../../extra/pageobjects/pages')],
      custom_commands_path: [path.join(__dirname, '../../extra/commands')],
      custom_assertions_path: [path.join(__dirname, '../../extra/assertions')],
      use_xpath: true,
      output: false,
      silent: false,
      globals: {
        abortOnAssertionFailure: true
      }
    });

    const page = Nightwatch.api().page.simplePageObjDefaultXpath();
    assert.strictEqual(page.elements.xpathElement.locateStrategy, 'xpath');
    assert.strictEqual(page.elements.xpathElement2.locateStrategy, 'xpath');
    assert.strictEqual(page.elements.cssSelectorElement.locateStrategy, 'css selector');
    assert.strictEqual(page.section.signUp.locateStrategy, 'xpath');
    assert.strictEqual(page.section.signUp.elements.start.locateStrategy, 'css selector');

    return new Promise((resolve, reject) => {
      Nightwatch.start(function(err) {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });

  it('page object defaults to css selector for shorthand when "use_xpath=false"', async function () {
    await Nightwatch.init({
      page_objects_path: [path.join(__dirname, '../../extra/pageobjects/pages')],
      custom_commands_path: [path.join(__dirname, '../../extra/commands')],
      custom_assertions_path: [path.join(__dirname, '../../extra/assertions')],
      use_xpath: false,
      output: false,
      silent: false,
      globals: {
        abortOnAssertionFailure: true
      }
    });

    const page = Nightwatch.api().page.simplePageObjDefaultXpath();
    assert.strictEqual(page.elements.xpathElement.locateStrategy, 'css selector');
    assert.strictEqual(page.elements.xpathElement2.locateStrategy, 'css selector');
    assert.strictEqual(page.elements.cssSelectorElement.locateStrategy, 'css selector');
    assert.strictEqual(page.section.signUp.locateStrategy, 'css selector');
    assert.strictEqual(page.section.signUp.elements.start.locateStrategy, 'css selector');

    return new Promise((resolve, reject) => {
      Nightwatch.start(function(err) {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });

  describe('elements', function () {
    beforeEach(function (done) {
      Nightwatch.init({
        page_objects_path: [path.join(__dirname, '../../extra/pageobjects/pages')],
        custom_commands_path: [path.join(__dirname, '../../extra/commands')],
        custom_assertions_path: [path.join(__dirname, '../../extra/assertions')],
        use_xpath: true,
        output: false,
        silent: false,
        globals: {
          abortOnAssertionFailure: true
        }
      }, done);
    });

    it('page object finds element', function (done) {
      nocks
        .elementsByXpath('//div')
        .text('0', 'first');


      let page = Nightwatch.api().page.simplePageObjDefaultXpath();

      page
        .getText('@xpathElement', function callback(result) {
          strictEqual(result.status, 0);
          strictEqual(result.value, 'first');
        });
      Nightwatch.start(done);
    });
  });
});
