import { expectAssignable, expectError, expectType } from "tsd";
import { ElementGlobal, NightwatchAPI, NightwatchCallbackResult, NightwatchSizeAndPosition } from "..";
import { WebElement } from "selenium-webdriver";

describe('global element() api', function () {
  it('test element()', async function() {
    // string as locator
    const elem = element('selector');
    expectType<ElementGlobal>(elem);
    expectType<WebElement>(await elem.getWebElement());

    // WebElement as selector
    expectType<ElementGlobal>(element(await elem.getWebElement()));

    // By as selector
    expectType<ElementGlobal>(element(by.css('selector')));

    // ElementProperties as selector
    expectType<ElementGlobal>(element({selector: 'selector', index: 4}));

    // with options
    expectType<ElementGlobal>(element('selector', {isComponent: true, type: 'vue'}));
  });


  it('test element() methods and properties', async function() {
    // string as locator
    const elem = element('selector');
    expectType<ElementGlobal>(elem);

    // .getId()
    expectAssignable<NightwatchAPI>(elem.getId(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    }));
    expectType<string>(await elem.getId());

    // .findElement()
    expectAssignable<NightwatchAPI>(elem.findElement());
    expectType<WebElement>(await elem.findElement());

    expectAssignable<NightwatchAPI>(elem.findElement('child-selector', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<WebElement>>(result);
    }));
    expectType<WebElement>(await elem.findElement('child-selector'));

    // .find()
    expectAssignable<NightwatchAPI>(elem.find());
    expectType<WebElement>(await elem.find());

    expectAssignable<NightwatchAPI>(elem.find('child-selector', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<ElementGlobal | null>>(result);
    }));
    expectType<ElementGlobal | null>(await elem.find('child-selector'));

    elem.find({using: 'css selector', value: 'child-selector'});
    expectError(elem.find({value: 'child-selector'}));
    expectError(elem.find({using: 'css selector', value: 'child-selector', abortOnFailure: true}));

    const elemProp = {locateStrategy: 'css selector', selector: 'child-selector', abortOnFailure: true};
    elem.find(elemProp);
    expectError(elem.find({locateStrategy: 'css selector', selector: 'child-selector', abortOnFailure: true}));

    expectError(elem.find({locateStrategy: 'css selector', value: 'child-selector'}));

    // .get()
    expectAssignable<NightwatchAPI>(elem.get());
    expectType<WebElement>(await elem.get());
    expectType<WebElement>(await elem.element());

    expectAssignable<NightwatchAPI>(elem.get('child-selector', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<ElementGlobal | null>>(result);
    }));
    expectType<ElementGlobal | null>(await elem.get('child-selector'));
    expectType<ElementGlobal | null>(await elem.element('child-selector'));

    // .findElements()
    expectAssignable<NightwatchAPI>(elem.findElements('child-selector', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<WebElement[]>>(result);
    }));
    expectType<WebElement[]>(await elem.findElements('child-selector'));

    // .findAll()
    expectAssignable<NightwatchAPI>(elem.findAll('child-selector', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<ElementGlobal[]>>(result);
    }));
    expectType<ElementGlobal[]>(await elem.findAll('child-selector'));

    // .clear()
    expectAssignable<NightwatchAPI>(elem.clear(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    }));
    expectType<null>(await elem.clear())

    // .click()
    expectAssignable<NightwatchAPI>(elem.click(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    }));
    expectType<null>(await elem.click());

    // .getAccessibleName()
    expectAssignable<NightwatchAPI>(elem.getAccessibleName(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    }));
    expectType<string>(await elem.getAccessibleName());
    expectType<string>(await elem.accessibleName());

    // .getAriaRole()
    expectAssignable<NightwatchAPI>(elem.getAriaRole(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    }));
    expectType<string>(await elem.getAriaRole());
    expectType<string>(await elem.ariaRole());

    // .getAttribute()
    expectAssignable<NightwatchAPI>(elem.getAttribute('attribute-name', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string | null>>(result);
    }));
    expectType<string | null>(await elem.getAttribute('attribute-name'));
    expectType<string | null>(await elem.attr('attribute-name'));
    expectType<string | null>(await elem.attribute('attribute-name'));

    // .getCssValue()
    expectAssignable<NightwatchAPI>(elem.getCssValue('prop-name', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    }));
    expectType<string>(await elem.getCssValue('prop-name'));
    expectType<string>(await elem.css('prop-name'));

    // .getProperty()
    expectAssignable<NightwatchAPI>(elem.getProperty('prop-name', function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string | null>>(result);
    }));
    expectType<string | null>(await elem.getProperty('prop-name'));
    expectType<string | null>(await elem.property('prop-name'));
    expectType<string | null>(await elem.prop('prop-name'));

    // .getRect()
    expectAssignable<NightwatchAPI>(elem.getRect(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<NightwatchSizeAndPosition>>(result);
    }));
    expectType<NightwatchSizeAndPosition>(await elem.getRect());
    expectType<NightwatchSizeAndPosition>(await elem.rect());

    // .getTagName()
    expectAssignable<NightwatchAPI>(elem.getTagName(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    }));
    expectType<string>(await elem.getTagName());
    expectType<string>(await elem.tagName());

    // .getText()
    expectAssignable<NightwatchAPI>(elem.getText(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    }));
    expectType<string>(await elem.getText());
    expectType<string>(await elem.text());

    // .sendKeys()
    expectAssignable<NightwatchAPI>(elem.sendKeys(1, 'something', browser.Keys.SPACE, Promise.resolve(2)));
    expectType<null>(await elem.sendKeys());

    // .submit()
    expectAssignable<NightwatchAPI>(elem.submit(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<null>>(result);
    }));
    expectType<null>(await elem.submit());

    // .takeScreenshot()
    expectAssignable<NightwatchAPI>(elem.takeScreenshot(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<string>>(result);
    }));
    expectType<string>(await elem.takeScreenshot());
    expectType<string>(await elem.screenshot());

    // .isDisplayed()
    expectAssignable<NightwatchAPI>(elem.isDisplayed(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<boolean>>(result);
    }));
    expectType<boolean>(await elem.isDisplayed());

    // .isEnabled()
    expectAssignable<NightwatchAPI>(elem.isEnabled(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<boolean>>(result);
    }));
    expectType<boolean>(await elem.isEnabled());

    // .isSelected()
    expectAssignable<NightwatchAPI>(elem.isSelected(function (result) {
      expectType<NightwatchAPI>(this);
      expectType<NightwatchCallbackResult<boolean>>(result);
    }));
    expectType<boolean>(await elem.isSelected());

    // .getWebElement()
    expectAssignable<NightwatchAPI>(elem.getWebElement());
    expectType<WebElement>(await elem.getWebElement());

    // .isComponent
    expectType<boolean>(elem.isComponent!);
  });
});
