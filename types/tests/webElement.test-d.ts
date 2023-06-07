import {expectError, expectType} from "tsd";
import { Element, Elements, ScopedElement } from "..";
import { WebElement } from "selenium-webdriver";

describe('new element() api', function () {
  test('test element.methodName()', async function () {
    const elementActive = browser.element.findActive();
    expectType<ScopedElement>(elementActive);
    expectType<WebElement>(await elementActive);

    const elementFind = browser.element.find('selector');
    expectType<ScopedElement>(elementFind);
    expectType<WebElement>(await elementFind);

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

    expectType<string | undefined>(elem.selector);
    expectType<number>(elem.index);
    expectType<string | null>(elem.resolvedElement);
  });
});
