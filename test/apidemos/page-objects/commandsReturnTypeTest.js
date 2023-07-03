const assert = require('assert');

describe('test return type of various commands on page-objects', function () {
  after(browser => browser.end());

  const pageObject = this.page.simplePageObj();

  it('return correct type on page objects in non-async mode', function() {
    const pageClick = pageObject.click('@loginCss');
    // pageClick does not have methods specific to NightwatchAPI
    assert.strictEqual(typeof pageClick.submit, 'undefined');
    assert.strictEqual(typeof pageClick.isChrome, 'undefined');
    // pageClick has page specific methods/properties
    assert.strictEqual(typeof pageClick.api, 'object');
    assert.strictEqual(typeof pageClick.testCommand, 'function');

    const pageAssert = pageObject.assert.visible('@loginCss');
    // pageAssert does not have methods specific to NightwatchAPI
    assert.strictEqual(typeof pageAssert.submit, 'undefined');
    assert.strictEqual(typeof pageAssert.isChrome, 'undefined');
    // pageAssert has page specific methods/properties
    assert.strictEqual(typeof pageAssert.api, 'object');
    assert.strictEqual(typeof pageAssert.testCommand, 'function');

    const pageNodeAssert = pageObject.assert.equal(1, 1);
    // pageNodeAssert does not have methods specific to NightwatchAPI
    assert.strictEqual(typeof pageNodeAssert.submit, 'undefined');
    assert.strictEqual(typeof pageNodeAssert.isChrome, 'undefined');
    // pageNodeAssert has page specific methods/properties
    assert.strictEqual(typeof pageNodeAssert.api, 'object');
    assert.strictEqual(typeof pageNodeAssert.testCommand, 'function');

    const pageCustomCommand = pageObject.testCommand();
    // pageCustomCommand does not have methods specific to NightwatchAPI
    assert.strictEqual(typeof pageCustomCommand.submit, 'undefined');
    assert.strictEqual(typeof pageCustomCommand.isChrome, 'undefined');
    // pageCustomCommand has page specific methods/properties
    assert.strictEqual(typeof pageCustomCommand.api, 'object');
    assert.strictEqual(typeof pageCustomCommand.testCommand, 'function');

    const pageChaiAssert = pageObject.expect.element('@loginCss').to.be.visible;
    // pageChaiAssert does not have methods specific to NightwatchAPI
    assert.strictEqual(typeof pageChaiAssert.submit, 'undefined');
    assert.strictEqual(typeof pageChaiAssert.isChrome, 'undefined');
    // pageChaiAssert *does not* have page specific methods/properties
    assert.strictEqual(typeof pageChaiAssert.api, 'undefined');
    assert.strictEqual(typeof pageChaiAssert.testCommand, 'undefined');
    // pageChaiAssert only have page Expect property/methods
    assert.strictEqual(typeof pageChaiAssert.a, 'function');
    assert.strictEqual(typeof pageChaiAssert.present, 'object');
  });

  it('return correct type on page objects in async mode', async function() {
    const pageClick = pageObject.click('@loginCss');
    assert.strictEqual(pageClick instanceof Promise, true);
    // pageClick does not have methods specific to NightwatchAPI
    assert.strictEqual(typeof pageClick.submit, 'undefined');
    assert.strictEqual(typeof pageClick.isChrome, 'undefined');
    // pageClick has page specific methods/properties
    assert.strictEqual(typeof pageClick.api, 'object');
    assert.strictEqual(typeof pageClick.testCommand, 'function');

    const pageAssert = pageObject.assert.visible('@loginCss');
    assert.strictEqual(pageAssert instanceof Promise, true);
    // pageAssert does not have methods specific to NightwatchAPI
    assert.strictEqual(typeof pageAssert.submit, 'undefined');
    assert.strictEqual(typeof pageAssert.isChrome, 'undefined');
    // pageAssert has page specific methods/properties
    assert.strictEqual(typeof pageAssert.api, 'object');
    assert.strictEqual(typeof pageAssert.testCommand, 'function');

    const pageNodeAssert = pageObject.assert.equal(1, 1);
    assert.strictEqual(pageNodeAssert instanceof Promise, true);
    // pageNodeAssert does not have methods specific to NightwatchAPI
    assert.strictEqual(typeof pageNodeAssert.submit, 'undefined');
    assert.strictEqual(typeof pageNodeAssert.isChrome, 'undefined');
    // pageNodeAssert has page specific methods/properties
    assert.strictEqual(typeof pageNodeAssert.api, 'object');
    assert.strictEqual(typeof pageNodeAssert.testCommand, 'function');

    const pageCustomCommand = pageObject.testCommand();
    assert.strictEqual(pageCustomCommand instanceof Promise, false);
    // pageCustomCommand does not have methods specific to NightwatchAPI
    assert.strictEqual(typeof pageCustomCommand.submit, 'undefined');
    assert.strictEqual(typeof pageCustomCommand.isChrome, 'undefined');
    // pageCustomCommand has page specific methods/properties
    assert.strictEqual(typeof pageCustomCommand.api, 'object');
    assert.strictEqual(typeof pageCustomCommand.testCommand, 'function');

    const pageChaiAssert = pageObject.expect.element('@loginCss').to.be.visible;
    assert.strictEqual(pageChaiAssert instanceof Promise, true);
    // pageChaiAssert does not have methods specific to NightwatchAPI
    assert.strictEqual(typeof pageChaiAssert.submit, 'undefined');
    assert.strictEqual(typeof pageChaiAssert.isChrome, 'undefined');
    // pageChaiAssert *does not* have page specific methods/properties
    assert.strictEqual(typeof pageChaiAssert.api, 'undefined');
    assert.strictEqual(typeof pageChaiAssert.testCommand, 'undefined');
    // pageChaiAssert only have page Expect property/methods
    assert.strictEqual(typeof pageChaiAssert.a, 'function');
    assert.strictEqual(typeof pageChaiAssert.present, 'object');
  });

  it('return correct type on sections in non-async mode', function() {
    const signUpSection = pageObject.section.signUp;

    const sectionClick = signUpSection.click('@help');
    // sectionClick does not have methods specific to NightwatchAPI
    assert.strictEqual(typeof sectionClick.submit, 'undefined');
    assert.strictEqual(typeof sectionClick.isChrome, 'undefined');
    // sectionClick does not page specific methods/properties
    assert.strictEqual(typeof sectionClick.testCommand, 'undefined');
    // sectionClick have section specific property/methods
    assert.strictEqual(typeof sectionClick.sectionElements, 'function');
    assert.strictEqual(typeof sectionClick.section, 'object');
  });

  it('return correct type on sections in async mode', async function() {
    const signUpSection = pageObject.section.signUp;

    const sectionClick = signUpSection.click('@help');
    assert.strictEqual(sectionClick instanceof Promise, true);
    // sectionClick does not have methods specific to NightwatchAPI
    assert.strictEqual(typeof sectionClick.submit, 'undefined');
    assert.strictEqual(typeof sectionClick.isChrome, 'undefined');
    // sectionClick does not page specific methods/properties
    assert.strictEqual(typeof sectionClick.testCommand, 'undefined');
    // sectionClick have section specific property/methods
    assert.strictEqual(typeof sectionClick.sectionElements, 'function');
    assert.strictEqual(typeof sectionClick.section, 'object');
  });
});
