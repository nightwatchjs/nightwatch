import {expectAssignable, expectError, expectType} from "tsd";
import { Element, ElementAssertions, ElementValue, Elements, ScopedElement, ScopedElementRect, ValueAssertions } from "..";
import { WebElement, WebElementPromise } from "selenium-webdriver";

describe('new element() api', function () {
  test('test element()', async function () {
    const elem = browser.element('selector');
    expectType<ScopedElement>(elem);
    expectType<WebElement>(await elem);

    // accepts WebElement
    expectType<ScopedElement>(browser.element(await elem));

    // accepts By selector
    expectType<ScopedElement>(browser.element(by.xpath('//tagname')));

    // accepts RelativeBy selector
    expectType<ScopedElement>(browser.element(locateWith(by.css('selector')).above(await elem)));

    // accepts ElementProperties
    expectType<ScopedElement>(browser.element({selector: 'selector', locateStrategy: 'css selector', abortOnFailure: false}));

    // accepts ElementProperties with Appium-specific locate strategies
    expectType<ScopedElement>(browser.element({selector: 'selector', locateStrategy: '-android uiautomator', abortOnFailure: false}));

    // accepts Element (ScopedElement is also assignable to Element)
    expectType<ScopedElement>(browser.element(elem));

    // accepts WebElementPromise
    expectType<ScopedElement>(browser.element(elem.webElement));

    // accepts Promise<WebElement>
    expectType<ScopedElement>(browser.element(Promise.resolve(await elem)));

    // backward compatibility
    expectType<ScopedElement>(browser.element('css selector', 'selector', function (result) {
      expectType<never>(result);
    }));
  });

  test('test element.methodName()', async function () {
    const elementActive = browser.element.findActive();
    expectType<ScopedElement>(elementActive);
    expectType<WebElement>(await elementActive);

    const elementFind = browser.element.find('selector');
    expectType<ScopedElement>(elementFind);
    expectType<WebElement>(await elementFind);

    expectType<ScopedElement>(browser.element.get('selector'));
    expectType<ScopedElement>(browser.element.findElement('selector'));

    const elementFindByText = browser.element.findByText('some-text', {exact: true, abortOnFailure: false});
    expectType<ScopedElement>(elementFindByText);

    const elementFindByRole = browser.element.findByRole('heading', {level: 2, expanded: true, retryInterval: 100});
    expectType<ScopedElement>(elementFindByRole);
    browser.element.findByRole('button', {current: false, expanded: true, index: 2});
    expectError(browser.element.findByRole('button', {level: 2, expanded: true, retryInterval: 100}));

    const elementFindByPlaceholderText = browser.element.findByPlaceholderText('some-text', {exact: true, abortOnFailure: false});
    expectType<ScopedElement>(elementFindByPlaceholderText);

    const elementFindByLabelText = browser.element.findByLabelText('some-text', {exact: true, abortOnFailure: false});
    expectType<ScopedElement>(elementFindByLabelText);

    const elementFindByAltText = browser.element.findByAltText('some-text', {exact: false, abortOnFailure: false});
    expectType<ScopedElement>(elementFindByAltText);

    // findAll
    const elementFindAll = browser.element.findAll('selector');
    expectType<Elements>(elementFindAll);
    expectType<WebElement[]>(await elementFindAll);

    expectType<ScopedElement>(elementFindAll.nth(2));
    expectType<number>(await elementFindAll.count());

    expectType<Elements>(browser.element.getAll('selector'));
    expectType<Elements>(browser.element.findElements('selector'));

    const elementFindAllByText = browser.element.findAllByText('some-text', {exact: true, abortOnFailure: false});
    expectType<Elements>(elementFindAllByText);

    const elementFindAllByRole = browser.element.findAllByRole('heading', {level: 2, expanded: true, retryInterval: 100});
    expectType<Elements>(elementFindAllByRole);
    browser.element.findAllByRole('button', {current: false, expanded: true, index: 2});
    expectError(browser.element.findAllByRole('button', {level: 2, expanded: true, retryInterval: 100}));

    const elementFindAllByPlaceholderText = browser.element.findAllByPlaceholderText('some-text', {exact: true, abortOnFailure: false});
    expectType<Elements>(elementFindAllByPlaceholderText);

    const elementFindAllByAltText = browser.element.findAllByAltText('some-text', {exact: false, abortOnFailure: false});
    expectType<Elements>(elementFindAllByAltText);
  });

  test('test ScopedElement has Element class properties', async function () {
    const elem = browser.element('selector');
    expectType<ScopedElement>(elem);
    expectAssignable<Element>(elem);
    expectAssignable<WebElement>(await elem);

    expectType<string | undefined>(elem.selector);
    expectType<number>(elem.index);
    expectType<string | null>(elem.resolvedElement);
  });

  test('test properties/methods in ScopedElement', async function () {
    const elem = browser.element('selector');
    expectType<ScopedElement>(elem);

    expectType<WebElementPromise>(elem.webElement);

    expectType<ScopedElement>(elem.find('selector'));
    expectType<ScopedElement>(elem.get('selector'));
    expectType<ScopedElement>(elem.findElement('selector'));

    expectType<ScopedElement>(elem.findByText('some-text', {exact: true, abortOnFailure: false}));

    expectType<ScopedElement>(elem.findByRole('heading', {level: 2, expanded: true, retryInterval: 100}));
    expectType<ScopedElement>(elem.findByRole('button', {current: false, expanded: true, index: 2}));
    expectError(elem.findByRole('button', {level: 2, expanded: true, retryInterval: 100}));

    expectType<ScopedElement>(elem.findByPlaceholderText('some-text', {exact: true, abortOnFailure: false}));
    expectType<ScopedElement>(elem.findByLabelText('some-text', {exact: true, abortOnFailure: false}));
    expectType<ScopedElement>(elem.findByAltText('some-text', {exact: true, abortOnFailure: false}));

    expectType<Elements>(elem.findAll('selector'));
    expectType<Elements>(elem.findElements('selector'));
    expectType<Elements>(elem.getAll('selector'));

    expectType<Elements>(elem.findAllByText('some-text', {exact: true, abortOnFailure: false}));

    expectType<Elements>(elem.findAllByRole('heading', {level: 2, expanded: true, retryInterval: 100}));
    expectType<Elements>(elem.findAllByRole('button', {current: false, expanded: true, index: 2}));
    expectError(elem.findAllByRole('button', {level: 2, expanded: true, retryInterval: 100}));

    expectType<Elements>(elem.findAllByPlaceholderText('some-text', {exact: true, abortOnFailure: false}));
    expectType<Elements>(elem.findAllByAltText('some-text', {exact: true, abortOnFailure: false}));

    expectType<ScopedElement>(elem.getFirstElementChild());
    expectType<ScopedElement>(elem.getLastElementChild());
    expectType<ScopedElement>(elem.getNextElementSibling());
    expectType<ScopedElement>(elem.getPreviousElementSibling());

    expectType<Omit<ScopedElement, 'then'> & PromiseLike<ShadowRoot>>(elem.getShadowRoot());
    expectType<ShadowRoot>(await elem.getShadowRoot());

    expectType<ElementValue<string>>(elem.getId());
    expectType<ElementValue<string>>(elem.getTagName());
    expectType<ElementValue<string>>(elem.tagName());
    expectType<ElementValue<string>>(elem.getText());
    expectType<ElementValue<string>>(elem.text());

    expectType<ElementValue<string | null>>(elem.getProperty('property-name'));
    expectType<ElementValue<string | null>>(elem.prop('property-name'));
    expectType<ElementValue<string | null>>(elem.property('property-name'));
    expectType<ElementValue<string | null>>(elem.getAttribute('attrib-name'));
    expectType<ElementValue<string | null>>(elem.attr('attrib-name'));
    expectType<ElementValue<string | null>>(elem.attribute('attrib-name'));
    expectType<ElementValue<string | null>>(elem.getValue());
    expectType<ElementValue<boolean>>(elem.isEnabled());
    expectType<ElementValue<boolean>>(elem.isPresent());
    expectType<ElementValue<boolean>>(elem.isSelected());
    expectType<ElementValue<boolean>>(elem.isVisible());
    expectType<ElementValue<boolean>>(elem.isDisplayed());
    expectType<ElementValue<boolean>>(elem.isActive());

    expectType<ElementValue<ScopedElementRect>>(elem.getRect());
    expectType<ElementValue<ScopedElementRect>>(elem.rect());
    expectType<ElementValue<ScopedElementRect>>(elem.getSize());
    expectType<ElementValue<ScopedElementRect>>(elem.getLocation());

    expectType<ElementValue<string>>(elem.getAccessibleName());
    expectType<ElementValue<string>>(elem.accessibleName());
    expectType<ElementValue<string>>(elem.getComputedLabel());
    expectType<ElementValue<string>>(elem.getAriaRole());
    expectType<ElementValue<string>>(elem.ariaRole());
    expectType<ElementValue<string>>(elem.getComputedRole());
    expectType<ElementValue<string>>(elem.getCssProperty('height'));
    expectType<ElementValue<string>>(elem.css('height'));
    expectType<ElementValue<string>>(elem.getCssValue('height'));
    expectType<ElementValue<string>>(elem.takeScreenshot());

    expectType<Promise<WebElement>>(elem.click());
    expectType<Promise<WebElement>>(elem.clear());
    expectType<Promise<WebElement>>(elem.check());
    expectType<Promise<WebElement>>(elem.uncheck());
    expectType<Promise<WebElement>>(elem.sendKeys('something', 1));
    expectType<Promise<WebElement>>(elem.update('something', 1));
    expectType<Promise<WebElement>>(elem.setValue('something', 1));
    expectType<Promise<WebElement>>(elem.submit());
    expectType<Promise<WebElement>>(elem.setProperty('type', 'text'));
    expectType<Promise<WebElement>>(elem.setAttribute('role', 'button'));
    expectType<Promise<WebElement>>(elem.dragAndDrop({x: 150, y: 500}));
    expectType<Promise<WebElement>>(elem.dragAndDrop(elem.webElement));
    expectType<Promise<WebElement>>(elem.moveTo(100, 100));
    expectType<Promise<WebElement>>(elem.clickAndHold());
    expectType<Promise<WebElement>>(elem.doubleClick());
    expectType<Promise<WebElement>>(elem.rightClick());
    expectType<Promise<WebElement>>(elem.waitUntil('visible', {timeout: 5000}));
  });

  test('test element assertions', async function () {
    const elem = browser.element('selector');
    expectType<ScopedElement>(elem);
    expectType<ElementAssertions>(elem.assert)
    expectType<ElementAssertions>(elem.assert.not);

    expectType<Promise<WebElement>>(elem.assert.enabled('some message'));
    expectType<WebElement>(await elem.assert.not.enabled());

    expectType<Promise<WebElement>>(elem.assert.not.present());
    expectType<WebElement>(await elem.assert.selected('some message'));

    expectType<Promise<WebElement>>(elem.assert.not.selected('some message'));
    expectType<WebElement>(await elem.assert.selected());

    expectType<Promise<WebElement>>(elem.assert.visible());
    expectType<WebElement>(await elem.assert.not.visible('some message'));

    expectType<Promise<WebElement>>(elem.assert.not.hasClass('some-class'));
    expectType<WebElement>(await elem.assert.hasClass('some-class', 'some message'));

    expectType<Promise<WebElement>>(elem.assert.hasAttribute('some-attribute', 'some message'));
    expectType<WebElement>(await elem.assert.not.hasAttribute('some-attribute'));

    expectType<Promise<WebElement>>(elem.assert.hasDescendants());
    expectType<WebElement>(await elem.assert.not.hasDescendants('some message'));
  });

  test('test ElementValue methods/properties', async function () {
    const elem = browser.element('selector');
    expectType<ScopedElement>(elem);

    const elemId = elem.getId();
    expectType<ElementValue<string>>(elemId);
    expectType<string>(await elemId);

    expectType<Promise<string>>(elemId.value);
    expectType<string>(await elemId.value);

    expectType<ValueAssertions<string>>(elemId.assert);
    expectType<Promise<string>>(elemId.assert.equals('elem-id'));
  });

  test('test ValueAssertions methods/properties', async function () {
    const elem = browser.element('selector');
    expectType<ScopedElement>(elem);

    const elemId = elem.getId();
    expectType<ValueAssertions<string>>(elemId.assert);
    expectType<ValueAssertions<string>>(elemId.assert.not);

    expectType<Promise<string>>(elemId.assert.equals('some text'));
    expectType<string>(await elemId.assert.not.equals('some text', 'some message'));

    expectType<Promise<string>>(elemId.assert.not.contains('text', 'some message'));
    expectType<string>(await elemId.assert.contains('some'));

    expectType<Promise<string>>(elemId.assert.matches(/^some text/, 'some message'));
    expectType<string>(await elemId.assert.not.matches(/some t[a-z]{3}$/));
  });
});
