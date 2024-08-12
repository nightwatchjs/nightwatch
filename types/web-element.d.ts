import {
  By,
  RelativeBy,
  WebElement,
  WebElementPromise
} from 'selenium-webdriver';

import {ElementProperties} from './page-object';
import {Element, LocateStrategy, NightwatchClient} from './index';

export interface ScopedElement extends Element, PromiseLike<WebElement> {
  assert: ElementAssertions;

  webElement: WebElementPromise;

  find(selector: ScopedElementSelector): ScopedElement;
  get(selector: ScopedElementSelector): ScopedElement;
  findElement(selector: ScopedElementSelector): ScopedElement;

  findByText(
    text: string,
    options?: Omit<ScopedSelectorObject, 'selector'> & {
      readonly exact?: boolean;
    }
  ): ScopedElement;

  findByRole(
    role: 'heading',
    options?: Omit<ScopedSelectorObject, 'selector'> & {
      readonly level?: number;
      readonly checked?: boolean;
      readonly current?: boolean | string;
      readonly pressed?: boolean;
      readonly expanded?: boolean;
      readonly selected?: boolean;
    }
  ): ScopedElement;

  findByRole(
    role: string,
    options?: Omit<ScopedSelectorObject, 'selector'> & {
      readonly current?: boolean | string;
      readonly checked?: boolean;
      readonly pressed?: boolean;
      readonly selected?: boolean;
      readonly expanded?: boolean;
    }
  ): ScopedElement;

  findByPlaceholderText(
    text: string,
    options?: Omit<ScopedSelectorObject, 'selector'> & {
      readonly exact?: boolean;
    }
  ): ScopedElement;

  findByLabelText(
    text: string,
    options?: Omit<ScopedSelectorObject, 'selector'> & {
      readonly exact?: boolean;
    }
  ): ScopedElement;

  findByAltText(
    text: string,
    options?: Omit<ScopedSelectorObject, 'selector'> & {
      readonly exact?: boolean;
    }
  ): ScopedElement;

  findAll(selector: ScopedSelector | Promise<ScopedSelector>): Elements;
  getAll(selector: ScopedSelector | Promise<ScopedSelector>): Elements;
  findElements(selector: ScopedSelector | Promise<ScopedSelector>): Elements;

  findAllByText(
    text: string,
    options?: Omit<ScopedSelectorObject, 'selector'> & {
      readonly exact?: boolean;
    }
  ): Elements;

  findAllByRole(
    role: 'heading',
    options?: Omit<ScopedSelectorObject, 'selector'> & {
      readonly level?: number;
      readonly checked?: boolean;
      readonly current?: boolean | string;
      readonly pressed?: boolean;
      readonly expanded?: boolean;
      readonly selected?: boolean;
    }
  ): Elements;

  findAllByRole(
    role: string,
    options?: Omit<ScopedSelectorObject, 'selector'> & {
      readonly current?: boolean | string;
      readonly checked?: boolean;
      readonly pressed?: boolean;
      readonly selected?: boolean;
      readonly expanded?: boolean;
    }
  ): Elements;

  getAllByRole(
    role: string,
    options?: Omit<ScopedSelectorObject, 'selector'> & {
      readonly current?: boolean | string;
      readonly checked?: boolean;
      readonly pressed?: boolean;
      readonly selected?: boolean;
      readonly expanded?: boolean;
    }
  ): Elements;

  findAllByPlaceholderText(
    text: string,
    options?: Omit<ScopedSelectorObject, 'selector'> & {
      readonly exact?: boolean;
    }
  ): Elements;

  findAllByAltText(
    text: string,
    options?: Omit<ScopedSelectorObject, 'selector'> & {
      readonly exact?: boolean;
    }
  ): Elements;

  getFirstElementChild(): ScopedElement;

  getLastElementChild(): ScopedElement;

  getNextElementSibling(): ScopedElement;

  getPreviousElementSibling(): ScopedElement;

  getShadowRoot(): Omit<ScopedElement, 'then'> & PromiseLike<ShadowRoot>;

  getId(): ElementValue<string>;

  getRect(): ElementValue<ScopedElementRect>;

  rect(): ElementValue<ScopedElementRect>;

  getSize(): ElementValue<ScopedElementRect>;

  getLocation(): ElementValue<ScopedElementRect>;

  getTagName(): ElementValue<string>;
  tagName(): ElementValue<string>;

  getText(): ElementValue<string>;
  text(): ElementValue<string>;

  click(): Promise<WebElement>;

  clear(): Promise<WebElement>;

  check(): Promise<WebElement>;
  uncheck(): Promise<WebElement>;

  sendKeys<E extends readonly unknown[]>(...keys: E): Promise<WebElement>;

  submit(): Promise<WebElement>;

  getProperty(name: string): ElementValue<string | null>;
  prop(name: string): ElementValue<string | null>;
  property(name: string): ElementValue<string | null>;

  setProperty(name: string, value: unknown): Promise<WebElement>;

  getAttribute(name: string): ElementValue<string | null>;
  attr(name: string): ElementValue<string | null>;
  attribute(name: string): ElementValue<string | null>;

  setAttribute(name: string, value: string | null): Promise<WebElement>;

  takeScreenshot(): ElementValue<string>;

  dragAndDrop(destination: DragAndDropDestination): Promise<WebElement>;

  moveTo(x?: number, y?: number): Promise<WebElement>;

  update<E extends readonly unknown[]>(...keys: E): Promise<WebElement>;

  upload(file: string): Promise<WebElement>;

  getAccessibleName(): ElementValue<string>;
  accessibleName(): ElementValue<string>;

  getAriaRole(): ElementValue<string>;
  ariaRole(): ElementValue<string>;

  getCssProperty(name: string): ElementValue<string>;
  css(name: string): ElementValue<string>;
  getCssValue(name: string): ElementValue<string>;

  getValue(): ElementValue<string | null>;

  setValue<E extends readonly unknown[]>(...keys: E): Promise<WebElement>;

  clickAndHold(): Promise<WebElement>;

  doubleClick(): Promise<WebElement>;

  rightClick(): Promise<WebElement>;

  waitUntil(signalOrOptions: WaitUntilActions | WaitUntilOptions, waitOptions?: WaitUntilOptions): Promise<WebElement>;

  isEnabled(): ElementValue<boolean>;

  isPresent(): ElementValue<boolean>;

  isSelected(): ElementValue<boolean>;

  isVisible(): ElementValue<boolean>;
  isDisplayed(): ElementValue<boolean>;
}

type WaitUntilOptions = {
  action?: WaitUntilActions;
  timeout?: number;
  message?: string;
  selector?: string;
  retryInterval?: number;
  abortOnFailure?: boolean;
};

type WaitUntilActions = 'selected' | 'visible' | 'disabled' | 'enabled' | 'not.selected' | 'not.visible' | 'not.enabled' | 'present' | 'not.present';

export class Elements implements PromiseLike<WebElement[]> {
  constructor(
    selector: ScopedElementSelector,
    parentScopedElement: ScopedElement | null,
    nightwatchInstance: NightwatchClient
  );

  then<R1 = WebElement[], R2 = never>(
    onfulfilled?:
      | ((value: WebElement[]) => R1 | PromiseLike<R1>)
      | null
      | undefined,
    onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | null | undefined
  ): PromiseLike<R1 | R2>;

  nth(index: number): ScopedElement;
  count(): ElementValue<number>;
}

export type ValueAssertionsOptions = {
  readonly negated: boolean;
  readonly nightwatchInstance: NightwatchClient;
};

export class ValueAssertions<T> {
  scopedValue: ElementValue<T>;

  get not(): ValueAssertions<T>;

  constructor(scopedValue: ElementValue<T>, options: ValueAssertionsOptions);

  contains(expected: string, message?: string): Promise<T>;

  equals(expected: T, message?: string): Promise<T>;

  matches(expected: string | RegExp, message?: string): Promise<T>;
}

export type ElementsAssertionsOptions = {
  readonly negated: boolean;
  readonly nightwatchInstance: NightwatchClient;
};

export class ElementsAssertions {
  constructor(elements: Elements, options: ElementsAssertionsOptions);

  get not(): ElementsAssertions;

}

export type ElementAssertionsOptions = {
  readonly negated: boolean;
  readonly nightwatchInstance: NightwatchClient;
};

export class ElementAssertions {
  constructor(element: ScopedElement, options: ElementAssertionsOptions);

  get not(): ElementAssertions;

  enabled(message?: string): Promise<WebElement>;

  selected(message?: string): Promise<WebElement>;

  visible(message?: string): Promise<WebElement>;

  present(message?: string): Promise<WebElement>;

  hasClass(name: string, message?: string): Promise<WebElement>;

  hasAttribute(name: string, message?: string): Promise<WebElement>;

  hasDescendants(message?: string): Promise<WebElement>;
}

export class ElementValue<T> implements PromiseLike<T> {
  value: Promise<T>;

  get assert(): ValueAssertions<T>;

  constructor(value: T | PromiseLike<T>, nightwatchInstance: NightwatchClient);

  then<R1 = T, R2 = never>(
    onfulfilled?: ((value: T) => R1 | PromiseLike<R1>) | null | undefined,
    onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | null | undefined
  ): PromiseLike<R1 | R2>;

  map<K>(callback: (value: T) => K | PromiseLike<K>): ElementValue<K>;
}

export type ScopedSelectorObject = Omit<
  ElementProperties,
  'webElement' | 'webElementId' | 'selector'
> & {
  readonly selector: string | By | RelativeBy;
};

type ScopedSelector = By | string | Element | RelativeBy | ElementProperties;

export class ElementLocator {
  index: number;
  timeout: number;
  condition: By | RelativeBy;
  retryInterval: number;
  locateStrategy: LocateStrategy;
  abortOnFailure: boolean;
  suppressNotFoundErrors: boolean;

  constructor(
    selector: ScopedSelector | ElementLocator,
    nightwatchInstance: NightwatchClient
  );
}

export type ScopedElementSelector =
  | WebElement
  | ScopedSelector
  | WebElementPromise
  | Promise<WebElement | ScopedSelector>;

export type ScopedElementRect = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export type DragAndDropDestination = {
  readonly xOffset: number;
  readonly yOffset: number;
};

export interface ElementFunction
  extends Pick<
    ScopedElement,
    'find' | 'get' | 'findElement' | 'findByText' | 'findByRole' | 'findByPlaceholderText' | 'findByLabelText' | 'findByAltText' |
    'findAll' | 'getAll' | 'findElements' | 'findAllByText' | 'findAllByRole' | 'findAllByPlaceholderText' | 'findAllByAltText'
  > {
  (selector: ScopedElementSelector): ScopedElement;
  (
    using: LocateStrategy,
    value: string,
    callback?: (result: never) => void
  ): ScopedElement;

  findActive(): ScopedElement;
}
