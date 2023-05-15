import {
  By,
  RelativeBy,
  WebElement,
  WebElementPromise
} from 'selenium-webdriver';

import {ElementProperties} from './page-object';
import {
  Element,
  Awaitable,
  Definition,
  ELEMENT_KEY,
  NightwatchAPI,
  LocateStrategy,
  NightwatchClient,
  NightwatchCallbackResult,
  ElementResult
} from './index';

export interface ScopedElement extends PromiseLike<WebElement> {
  assert: ElementAssertions;

  find(selector: ScopedElementSelector): ScopedElement;
  get(selector: ScopedElementSelector): ScopedElement;

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
  
  findAll(selector: ScopedElementSelector): Elements;
  getAll(selector: ScopedElementSelector): Elements;

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

  getShadowRoot(): ScopedElement;

  getId(): ElementValue<string>;

  getRect(): ElementValue<ScopedElementRect>;

  getTagName(): ElementValue<string>;

  getText(): ElementValue<string>;

  click(): this;

  clear(): this;

  sendKeys<E extends readonly unknown[]>(...keys: E): this;

  submit(): this;

  getProperty<V>(name: string): ElementValue<V>;

  setProperty(name: string, value: unknown): this;

  getAttribute(name: string): ElementValue<string | null>;

  setAttribute(name: string, value: string | null): this;

  takeScreenshot(shouldBeInView?: boolean): Promise<string>;

  dragAndDrop(destination: DragAndDropDestination): this;

  moveTo(x?: number, y?: number): this;

  update<E extends readonly unknown[]>(...keys: E): this;

  getAccessibleName(): ElementValue<string>;

  getAriaRole(): ElementValue<string>;

  getCssProperty(name: string): ElementValue<string>;

  getSize(): ElementValue<ScopedElementRect>;

  getValue(): ElementValue<string>;

  clickAndHold(): this;

  doubleClick(): this;

  rightClick(): this;

  waitUntil(signalOrOptions: WaitUntilActions | WaitUntilOptions, waitOptions?: WaitUntilOptions): this;
}

type WaitUntilOptions = {
  action?: WaitUntilActions;
  timeout?: number;
  message?: string;
  selector?: string;
  retryInterval?: number;
  abortOnFailure?: boolean;
};

type WaitUntilActions = 'selected' | 'visible' | 'disabled' | 'enabled' | 'not.selected' | 'not.visible' | 'not.enabled';

export class Elements implements PromiseLike<ScopedElement[]> {
  constructor(
    selector: ScopedElementSelector,
    parentScopedElement: ScopedElement | null,
    nightwatchInstance: NightwatchClient
  );

  then<R1 = ScopedElement[], R2 = never>(
    onfulfilled?:
      | ((value: ScopedElement[]) => R1 | PromiseLike<R1>)
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
  nightwatchInstance: NightwatchClient;

  get not(): ValueAssertions<T>;

  constructor(scopedValue: ElementValue<T>, options: ValueAssertionsOptions);

  contains(expected: string, message?: string): ElementValue<T>;

  equals(expected: T, message?: string): ElementValue<T>;

  matches(expected: string | RegExp, message?: string): ElementValue<T>;
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

  enabled(message?: string): ScopedElement;

  selected(message?: string): ScopedElement;

  visible(message?: string): ScopedElement;

  present(message?: string): ScopedElement;

  hasClass(name: string, message?: string): ScopedElement;

  hasAttribute(name: string, message?: string): ScopedElement;

  hasDescendants(message?: string): ScopedElement;
}

export class ElementValue<T> implements PromiseLike<T> {
  value: Promise<T>;
  nightwatchInstance: NightwatchClient;

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

export interface ElementFunction {
  (locator: Definition | By | WebElement, options?: any): Element;
  (selector: ScopedElementSelector): ScopedElement;
  (
    using: LocateStrategy,
    value: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<ElementResult>
    ) => void
  ): Awaitable<this, ElementResult>;

  findActive(): ScopedElement;

  find(selector: ScopedElementSelector): ScopedElement;

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
  
  findAll(selector: ScopedElementSelector): Elements;
  
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
}
