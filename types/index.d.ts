// Type definitions for nightwatch 2.3
// Project: http://nightwatchjs.org
// Definitions by: Rahul Kavalapara <https://github.com/rkavalap>
//                 Connor Schlesiger <https://github.com/schlesiger>
//                 Clayton Astrom <https://github.com/ClaytonAstrom>
//                 Lukas Beranek <https://github.com/lloiser>
//                 Vaibhav Singh <https://github.com/vaibhavsingh97>
//                 Andrei Rusu <https://github.com/beatfactor>
//                 David Burns <https://github.com/AutomatedTester>
//                 Ravi Sawlani <https://github.com/gravityvi>
//                 Binayak Ghosh <https://github.com/swrdfish>
//                 Harshit Agrawal <https://github.com/harshit-bs>
//                 David Mello <https://github.com/literallyMello>
//                 Luke Bickell <https://github.com/lukebickell>
//                 Priyansh Garg <https://github.com/garg3133>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 4.5
// Nightwatch Version: 3.0.0

import { Protocol } from 'devtools-protocol';
import {
  By as SeleniumBy,
  Actions,
  Capabilities,
  WebElement,
  WebDriver,
  RelativeBy,
  locateWith as seleniumLocateWith
} from 'selenium-webdriver';

import { Expect } from './expect';
import { Assert } from './assertions';
import { ElementFunction } from './web-element';
import { NightwatchGlobals } from './globals';
import { EnhancedPageObject } from './page-object';
import { NightwatchCustomCommands } from './custom-command';
import { NightwatchDesiredCapabilities } from './desired-capabilities';
import { NightwatchOptions, NightwatchTestOptions } from './nightwatch-options';
import { IfUnknown } from './utils';

export * from './globals';
export * from './expect';
export * from './web-element';
export * from './custom-assertion';
export * from './custom-command';
export * from './page-object';
export * from './desired-capabilities';
export * from './nightwatch-options';
export * from './assertions';

export const ELEMENT_KEY = 'element-6066-11e4-a52e-4f735466cecf';

export interface ElementResult {
  [ELEMENT_KEY]: string;
}

export interface JSON_WEB_OBJECT extends ElementResult {
  getId: () => string;
}

export type ScopedSelector = string | ElementProperties | Element | SeleniumBy | RelativeBy;
export type Definition = ScopedSelector | WebElement;

export type NightwatchGenericCallback<T> = (
  this: NightwatchAPI,
  result: NightwatchCallbackResult<T>
) => void

export type Awaitable<T, V> = Omit<T, 'then'> & PromiseLike<V>;

// tslint:disable-next-line
type VoidToNull<T> = T extends void ? null : T;

type ExecuteScriptFunction<ArgType extends any[], ReturnValue> = (this: { [key: string]: any }, ...args: ArgType) => ReturnValue;

type ExecuteAsyncScriptFunction<ArgType extends any[], ReturnValue> =
  (this: { [key: string]: any }, ...args: [...innerArgs: ArgType, done: (result?: ReturnValue) => void]) => void;

export interface AppiumGeolocation {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface NightwatchTestSuite {
  name: string;
  module: string;
  group: string;
  results: any;
}

export interface NightwatchEnsureResult {
  value: null;
  returned: 1;
}

export interface Ensure {
  /**
   * Ensures that the Nightwatch WebDriver client is able to switch to the designated frame.
   */
  ableToSwitchToFrame(
    frame: number | WebElement | SeleniumBy
  ): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that waits for an alert to be opened.
   */
  alertIsPresent(): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that will wait for the given element to be disabled.
   */
  elementIsDisabled(
    element: WebElement | Element | string
  ): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that will wait for the given element to be enabled.
   */
  elementIsEnabled(
    element: WebElement
  ): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that will wait for the given element to be deselected.
   */
  elementIsNotSelected(
    element: WebElement | Element | string
  ): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that will wait for the given element to be in the DOM, yet not displayed to the user.
   */
  elementIsNotVisible(
    element: WebElement | Element | string
  ): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that will wait for the given element to be selected.
   */
  elementIsSelected(
    element: WebElement | Element | string
  ): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that will wait for the given element to be displayed.
   */
  elementIsVisible(
    element: WebElement | Element | string
  ): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that will loop until an element is found with the given locator.
   */
  elementLocated(locator: SeleniumBy): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that will wait for the given element's text to contain the given substring.
   */
  elementTextContains(
    element: WebElement | Element | string,
    substr: string
  ): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that will wait for the given element's text to equal the given text.
   */
  elementTextIs(
    element: WebElement | Element | string,
    text: string
  ): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that will wait for the given element's text to match a given regular expression.
   */
  elementTextMatches(
    element: WebElement | Element | string,
    regex: RegExp
  ): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that will loop until at least one element is found with the given locator.
   */
  elementsLocated(
    locator: SeleniumBy
  ): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that will wait for the given element to become stale.
   * An element is considered stale once it is removed from the DOM, or a new page has loaded.
   */
  stalenessOf(
    element: WebElement | Element | string
  ): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that will wait for the current page's title to contain the given substring.
   */
  titleContains(
    substr: string
  ): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that will wait for the current page's title to match the given value.
   */
  titleIs(title: string): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that will wait for the current page's title to match the given regular expression.
   */
  titleMatches(regex: RegExp): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that will wait for the current page's url to contain the given substring.
   */
  urlContains(
    substrUrl: string
  ): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that will wait for the current page's url to match the given value.
   */
  urlIs(url: string): Awaitable<NightwatchAPI, NightwatchEnsureResult>;

  /**
   * Creates a condition that will wait for the current page's url to match the given regular expression.
   */
  urlMatches(regex: RegExp): Awaitable<NightwatchAPI, NightwatchEnsureResult>;
}

export interface ElementProperties {
  /**
   * the element selector name
   *
   * @example
   * '@searchBar'
   */
  selector: string;

  /**
   * locator strategy can be one of
   *  - css selector
   *  - link text
   *  - partial link text
   *  - tag name
   *  - xpath
   *
   * @example
   * 'css selector'
   */
  locateStrategy?: LocateStrategy;

  /**
   * used to target a specific element in a query that results in multiple elements returned. Normally,
   * only the first element is used (index = 0) but using the index property, you can specify any element within the result.
   */
  index?: number;

  /**
   * used to overwrite this setting when using waitForElement* commands.
   */
  abortOnFailure?: boolean;

  /**
   * used to overwrite the default timeout for when using waitForElement* commands or assertions.
   */
  timeout?: number;

  /**
   * used to overwrite the default retry interval for when using waitForElement* commands or assertions.
   */
  retryInterval?: number;

  /**
   * Some element commands like .click() or .getText() will throw a NoSuchElement error if the element cannot be located, causing the test to fail.
   * If this option is set to true then this error is ignored.
   */
  suppressNotFoundErrors?: boolean;
}

export interface NightwatchTypedCallbackResult<T> {
  status: 0;
  value: T;
  error: Error;
}
export interface NightwatchCallbackResultError {
  status: 1; // we cannot use `number` so giving it a "symbolic" value allows to disjoint the union
  value: {
    message: string;
    screen: string;
    class: string;
    stackTrace: Array<{
      fileName: string;
      lineNumber: number;
      className: string;
      methodName: string;
    }>;
  };
  state: Error | string;
}

export type NightwatchCallbackResult<T> =
  | NightwatchTypedCallbackResult<T>
  | NightwatchCallbackResultError;

export interface NightwatchLogEntry {
  /**
   * The log entry message.
   */
  message: string;

  /**
   * The time stamp of log entry in seconds.
   */
  timestamp: number;

  /**
   * The log type.
   */
  type: string;

  /**
   * Severity level
   */
  level: Level
}

export interface Level {
  /**
   * the level's name.
   */
  name: 'ALL' | 'DEBUG' | 'FINE' | 'FINER' | 'FINEST' | 'INFO' | 'OFF' | 'SEVERE' | 'WARNING';

  /**
   * the level's numeric value.
   */
  value: number;
}

export interface NightwatchKeys {
  /** Releases all held modifier keys. */
  NULL: string;
  /** OS-specific keystroke sequence that performs a cancel action. */
  CANCEL: string;
  /** The help key. This key only appears on older Apple keyboards in place of the Insert key. */
  HELP: string;
  /** The backspace key. */
  BACK_SPACE: string;
  /** The tab key. */
  TAB: string;
  /** The clear key. This key only appears on full-size Apple keyboards in place of Num Lock key. */
  CLEAR: string;
  /** The return key. */
  RETURN: string;
  /** The enter (numpad) key. */
  ENTER: string;
  /** The shift key. */
  SHIFT: string;
  /** The control key. */
  CONTROL: string;
  /** The alt key. */
  ALT: string;
  /** The pause key. */
  PAUSE: string;
  /** The escape key. */
  ESCAPE: string;

  /** The space bar. */
  SPACE: string;
  /** The page up key. */
  PAGEUP: string;
  /** The page down key. */
  PAGEDOWN: string;
  /** The end key. */
  END: string;
  /** The home key. */
  HOME: string;
  /** The left arrow. */
  ARROW_LEFT: string;
  LEFT_ARROW: string;
  /** The up arrow. */
  ARROW_UP: string;
  UP_ARROW: string;
  /** The right arrow. */
  ARROW_RIGHT: string;
  RIGHT_ARROW: string;
  /** The down arrow. */
  ARROW_DOWN: string;
  DOWN_ARROW: string;
  /** The insert key. */
  INSERT: string;
  /** The delete key. */
  DELETE: string;
  /** The semicolon key. */
  SEMICOLON: string;
  /** The equals key. */
  EQUALS: string;

  /** The numpad zero key. */
  NUMPAD0: string;
  /** The numpad one key. */
  NUMPAD1: string;
  /** The numpad two key. */
  NUMPAD2: string;
  /** The numpad three key. */
  NUMPAD3: string;
  /** The numpad four key. */
  NUMPAD4: string;
  /** The numpad five key. */
  NUMPAD5: string;
  /** The numpad six key. */
  NUMPAD6: string;
  /** The numpad seven key. */
  NUMPAD7: string;
  /** The numpad eight key. */
  NUMPAD8: string;
  /** The numpad nine key. */
  NUMPAD9: string;

  /** The numpad multiply (*) key. */
  MULTIPLY: string;
  /** The numpad add (+) key. */
  ADD: string;
  /** The numpad separator (=) key. */
  SEPARATOR: string;
  /** The numpad subtract (-) key. */
  SUBTRACT: string;
  /** The numpad decimal (.) key. */
  DECIMAL: string;
  /** The numpad divide (/) key. */
  DIVIDE: string;

  /** The F1 key. */
  F1: string;
  /** The F2 key. */
  F2: string;
  /** The F3 key. */
  F3: string;
  /** The F4 key. */
  F4: string;
  /** The F5 key. */
  F5: string;
  /** The F6 key. */
  F6: string;
  /** The F7 key. */
  F7: string;
  /** The F8 key. */
  F8: string;
  /** The F9 key. */
  F9: string;
  /** The F10 key. */
  F10: string;
  /** The F11 key. */
  F11: string;
  /** The F12 key. */
  F12: string;
  /** The meta (Windows) key. */
  META: string;
  /** The command (⌘) key. */
  COMMAND: string;
}

/**
 * Kept for backward compatibility.
 *
 * NightwatchPage provides some basic types for page objects.
 * Users can keep using these default types for page objects, but if they want
 * to be strict, they can define their own page object types by extending
 * `NightwatchCustomPageObjects` interface.
 *
 * @example
 * // using default types
 * const googlePage = browser.page.google();
 *
 * // defining types by extending NightwatchCustomPageObjects interface
 * interface GooglePage
 *   extends EnhancedPageObject<
 *     typeof googleCommands,
 *     typeof googlePage.elements
 *   > {}
 *
 * declare module 'nightwatch' {
 *   interface NightwatchCustomPageObjects {
 *     google(): GooglePage;
 *   }
 * }
 *
 * const googlePage = browser.page.google(); // type automatically inferred as GooglePage
 */
export type NightwatchPage = {
  [name: string]: () => EnhancedPageObject<any, any, any>;
} & {
  [name: string]: NightwatchPage;
};

export interface NamespacedApi<ReturnType = unknown> {
  appium: AppiumCommands<ReturnType>;
  cookies: CookiesNsCommands<ReturnType>;
  alerts: AlertsNsCommands<ReturnType>;
  document: DocumentNsCommands<ReturnType>;
  logs: LogsNsCommands<ReturnType>;
  window: WindowNsCommands<ReturnType>;
  firefox: FirefoxNsCommands<ReturnType>;
  chrome: ChromeNsCommands<ReturnType>;
  network: NetworkNsCommands<ReturnType>;

  assert: Assert<ReturnType>;
  verify: Assert<ReturnType>;
  expect: Expect;
}

export interface NightwatchApiCommands {
  readonly WEBDRIVER_ELEMENT_ID: string;
  readonly browserName: string;
  readonly platformName: string;
  __isBrowserName(browser: string, alternateName: string): boolean;
  __isPlatformName(platform: string): boolean;
  isIOS(): boolean;
  isAndroid(): boolean;
  isMobile(): boolean;
  isSafari(): boolean;
  isChrome(): boolean;
  isFirefox(): boolean;
  isEdge(): boolean;
  isInternetExplorer(): boolean;
  isOpera(): boolean;

  /**
   * Whether or not Nightwatch is being used to connect to an Appium server.
   */
  isAppiumClient(): boolean;
}

export interface NightwatchAPI
  extends SharedCommands,
  WebDriverProtocol,
  NightwatchCustomCommands,
  NightwatchApiCommands,
  NamespacedApi<NightwatchAPI> {
  baseUrl: string;
  actions(options?: { async?: boolean; bridge?: boolean }): Actions;
  ensure: Ensure;

  page: NightwatchPage & NightwatchCustomPageObjects;

  /**
   * SessionId of the session used by the Nightwatch api.
   */
  sessionId: string;

  /**
   * Override the sessionId used by Nightwatch client with another session id.
   */
  setSessionId(sessionId: string): this;

  options: NightwatchTestOptions;

  Keys: NightwatchKeys;

  currentTest: NightwatchTestSuite;

  globals: NightwatchGlobals;

  /**
   * https://www.selenium.dev/selenium/docs/api/javascript/WebDriver.html
   */
  driver: WebDriver;

  launchUrl: string;
  launch_url: string;
}

// tslint:disable-next-line:no-empty-interface
export interface NightwatchCustomPageObjects { }

/**
 * @deprecated Use `NightwatchAPI` instead.
 */
export interface NightwatchBrowser
  extends NightwatchAPI,
  NightwatchComponentTestingCommands,
  NightwatchCustomCommands { }

/**
 * @deprecated Please use the types exported by individual plugins.
 */
export interface NightwatchComponentTestingCommands {
  /**
   * @deprecated Please use the types exported by individual plugins.
   */
  importScript(
    scriptPath: string,
    options: { scriptType: string; componentType: string },
    callback: () => void
  ): this;

  /**
   * @deprecated Please use the types exported by individual plugins.
   */
  mountReactComponent(
    componentPath: string,
    props?: string | (() => void),
    callback?: () => void
  ): Element;

  /**
   * @deprecated Please use the types exported by individual plugins.
   */
  mountComponent(
    componentPath: string,
    props?: string | (() => void),
    callback?: () => void
  ): Element;

  /**
   * @deprecated Please use the types exported by individual plugins.
   */
  mountVueComponent(
    componentPath: string,
    options?: any,
    callback?: () => void
  ): Element;

  /**
   * @deprecated Please use the types exported by individual plugins.
   */
  launchComponentRenderer(): this;
}

// tslint:disable-next-line
export interface NightwatchElement extends WebElement { }

export type NightwatchTest = (browser?: NightwatchBrowser) => void;

export interface NightwatchTestFunctions {
  before?: NightwatchTestHook;
  after?: NightwatchTestHook;
  beforeEach?: NightwatchTestHook;
  afterEach?: NightwatchTestHook;

  '@tags'?: string | string[];
  '@disabled'?: boolean;

  [key: string]: any;
}

export type NightwatchTestHook = (
  browser: NightwatchBrowser,
  done: (err?: unknown) => void
) => void;

export class Element {
  name: string | undefined;
  locateStrategy: LocateStrategy;
  index: number;
  selector: string | undefined; // and probably `RelativeBy`.
  pseudoSelector: string | null;

  resolvedElement: string | null;
  parent: any;
  usingRecursion: boolean;

  webElement?: WebElement;
  webElementId?: string;

  abortOnFailure?: boolean;
  suppressNotFoundErrors?: boolean;
  retryInterval?: number;
  message?: string;
  timeout?: number;
}

type ElementGlobalDefinition = string | SeleniumBy | RelativeBy | { selector: string; locateStrategy?: string } | { using: string, value: string };

export interface ElementGlobal extends Element {
  /**
   * Get the server-assigned opaque ID assigned to this element.
   */
  getId(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<string>) => void
  ): Awaitable<NightwatchAPI, string>;

  /**
   * Locates the descendants of this element that match the given search criteria, and returns the first one.
   *
   * If no `selector` is passed, returns the [WebElement](https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html)
   * instance for this element.
   */
  findElement(): Awaitable<NightwatchAPI, WebElement>;
  findElement(
    selector: ElementGlobalDefinition,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<WebElement>) => void
  ): Awaitable<NightwatchAPI, WebElement>;

  /**
   * Locates and wraps the first element, that match the given search criteria in the descendants of this element, in global element() api object.
   *
   * If no `selector` is passed, returns the [WebElement](https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html)
   * instance for this element.
   */
  find(): Awaitable<NightwatchAPI, WebElement>;
  find(
    selector: ElementGlobalDefinition,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<ElementGlobal | null>) => void
  ): Awaitable<NightwatchAPI, ElementGlobal | null>;

  get: ElementGlobal['find'];
  element: ElementGlobal['find'];

  /**
   * Locates all of the descendants of this element that match the given search criteria.
   */
  findElements(
    selector: ElementGlobalDefinition,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<WebElement[]>) => void
  ): Awaitable<NightwatchAPI, WebElement[]>;

  findAll(
    selector: ElementGlobalDefinition,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<ElementGlobal[]>) => void
  ): Awaitable<NightwatchAPI, ElementGlobal[]>;

  /**
   * Clear the `value` of this element. This command has no effect if the underlying DOM element
   * is neither a text INPUT element nor a TEXTAREA element.
   *
   * @see https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html#clear
   */
  clear(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void
  ): Awaitable<NightwatchAPI, null>;

  /**
   * Clicks on this element.
   *
   * @see https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html#click
   */
  click(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void
  ): Awaitable<NightwatchAPI, null>;

  /**
   * Get the computed WAI-ARIA label of element.
   */
  getAccessibleName(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<string>) => void
  ): Awaitable<NightwatchAPI, string>;
  /**
   * Get the computed WAI-ARIA label of element.
   */
  accessibleName: ElementGlobal['getAccessibleName'];

  /**
   * Get the computed WAI-ARIA role of element.
   */
  getAriaRole(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<string>) => void
  ): Awaitable<NightwatchAPI, string>;
  /**
   * Get the computed WAI-ARIA role of element.
   */
  ariaRole: ElementGlobal['getAriaRole'];

  /**
   * Retrieves the current value of the given attribute of this element.
   *
   * @see https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html#getAttribute
   */
  getAttribute(
    attributeName: string,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<string | null>) => void
  ): Awaitable<NightwatchAPI, string | null>;
  /**
   * Retrieves the current value of the given attribute of this element.
   *
   * @see https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html#getAttribute
   */
  attr: ElementGlobal['getAttribute'];
  /**
   * Retrieves the current value of the given attribute of this element.
   *
   * @see https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html#getAttribute
   */
  attribute: ElementGlobal['getAttribute'];

  /**
   * Retrieves the value of a computed style property for this instance.
   *
   * @see https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html#getCssValue
   */
  getCssValue(
    cssStyleProperty: string,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<string>) => void
  ): Awaitable<NightwatchAPI, string>;
  /**
   * Retrieves the value of a computed style property for this instance.
   *
   * @see https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html#getCssValue
   */
  css: ElementGlobal['getCssValue'];

  /**
   * Retrieves the value of the given property of this element.
   */
  getProperty(
    propertyName: string,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<string | null>) => void
  ): Awaitable<NightwatchAPI, string | null>;
  /**
   * Retrieves the value of the given property of this element.
   */
  property: ElementGlobal['getProperty'];
  /**
   * Retrieves the value of the given property of this element.
   */
  prop: ElementGlobal['getProperty'];

  /**
   * Returns an object describing an element's location, in pixels relative to the document element, and the element's size in pixels.
   */
  getRect(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<NightwatchSizeAndPosition>) => void
  ): Awaitable<NightwatchAPI, NightwatchSizeAndPosition>;
  /**
   * Returns an object describing an element's location, in pixels relative to the document element, and the element's size in pixels.
   */
  rect: ElementGlobal['getRect'];

  /**
   * Retrieves the element's tag name.
   */
  getTagName(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<string>) => void
  ): Awaitable<NightwatchAPI, string>;
  /**
   * Retrieves the element's tag name.
   */
  tagName: ElementGlobal['getTagName'];

  /**
   * Get the visible (i.e. not hidden by CSS) innerText of this element, including sub-elements, without any leading or trailing whitespace.
   */
  getText(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<string>) => void
  ): Awaitable<NightwatchAPI, string>;
  /**
   * Get the visible (i.e. not hidden by CSS) innerText of this element, including sub-elements, without any leading or trailing whitespace.
   */
  text: ElementGlobal['getText'];

  /**
   * Types a key sequence on the DOM element represented by this instance.
   *
   * @example
   * element(<selector>).sendKeys(1, 'something', browser.Keys.SPACE, Promise.resolve(2));
   *
   * @see https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html#sendKeys
   */
  sendKeys(
    ...args: Array<string | number | PromiseLike<string> | PromiseLike<number>>
  ): Awaitable<NightwatchAPI, null>;

  /**
   * Submits the form containing this element (or this element if it is itself a FORM element).
   * This command is a no-op if the element is not contained in a form.
   *
   * @see https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html#submit
   */
  submit(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void
  ): Awaitable<NightwatchAPI, null>;

  /**
   * Take a screenshot of the visible region encompassed by this element's bounding rectangle.
   */
  takeScreenshot(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<string>) => void
  ): Awaitable<NightwatchAPI, string>;
  /**
   * Take a screenshot of the visible region encompassed by this element's bounding rectangle.
   */
  screenshot: ElementGlobal['takeScreenshot'];

  /**
   * Test whether this element is currently displayed.
   */
  isDisplayed(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<boolean>) => void
  ): Awaitable<NightwatchAPI, boolean>;

  /**
   * Tests whether this element is enabled, as dictated by the `disabled` attribute.
   */
  isEnabled(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<boolean>) => void
  ): Awaitable<NightwatchAPI, boolean>;

  /**
   * Tests whether this element is selected.
   */
  isSelected(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<boolean>) => void
  ): Awaitable<NightwatchAPI, boolean>;

  /**
   * Get the [WebElement](https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html) instance for this element.
   */
  getWebElement(): Awaitable<NightwatchAPI, WebElement>;

  isComponent?: boolean;
}

export function globalElement(
  locator: Definition,
  options?: {
    isComponent?: boolean;
    type: string;
  }
): ElementGlobal;

export type NightwatchTests = NightwatchTestFunctions;

export class DescribeInstance {
  '[instance]': any;
  '[attributes]': {};
  '[client]': NightwatchClient;

  /**
   * Title of the describe suite.
   */
  get name(): string;

  /**
   * Get or set tags for the test suite.
   *
   * @see https://nightwatchjs.org/guide/running-tests/filtering-by-test-tags.html
   */
  get tags(): string | string[];
  set tags(value: string | string[]);

  /**
   * Enable if the current test is a unit/integration test
   * (no webdriver session is required).
   */
  get unitTest(): boolean;
  set unitTest(value: boolean);

  /**
   * Set to false if you'd like the browser window to be kept open
   * in case of a failure or error (useful for debugging).
   */
  get endSessionOnFail(): boolean;
  set endSessionOnFail(value: boolean);

  /**
   * Set to false if you'd like the rest of the test cases/test steps
   * to be executed in the event of an assertion failure/error.
   */
  get skipTestcasesOnFail(): boolean;
  set skipTestcasesOnFail(value: boolean);

  /**
   * Set to true if you'd like this test suite to be skipped by the
   * test runner.
   */
  get disabled(): boolean;
  set disabled(value: boolean);

  /**
   * Get or set testsuite specific capabilities.
   */
  get desiredCapabilities(): NightwatchDesiredCapabilities;
  set desiredCapabilities(value: NightwatchDesiredCapabilities);

  /**
   * Get available page objects.
   */
  get page(): NightwatchAPI['page'];

  /**
   * Get all current globals.
   */
  get globals(): NightwatchGlobals;

  /**
   * Get all current settings.
   */
  get settings(): NightwatchOptions;

  /**
   * Get all current cli arguments.
   */
  get argv(): { [key: string]: any };

  /**
   * Get all current mocha options.
   */
  get mochaOptions(): { [key: string]: any } | undefined;

  /**
   * Control the unit test timeout.
   *
   * Control the assertion and element commands timeout until when
   * an element should be located or assertion passed.
   *
   * @param value Timeout in `ms`
   */
  timeout(value: number): void;

  /**
   * Get the assertion and element commands timeout until when
   * an element would be located or assertion passed.
   *
   * @returns Timeout in `ms`
   */
  waitForTimeout(): number;

  /**
   * Control the assertion and element commands timeout until when
   * an element should be located or assertion passed.
   *
   * @param value Timeout in `ms`
   */
  waitForTimeout(value: number): void;

  /**
   * Get the polling interval between re-tries for assertions
   * or element commands.
   *
   * @returns Time interval in `ms`
   */
  waitForRetryInterval(): number;

  /**
   * Control the polling interval between re-tries for assertions
   * or element commands.
   *
   * @param value Time interval in `ms`
   */
  waitForRetryInterval(value: number): void;

  /**
   * Control the polling interval between re-tries for assertions
   * or element commands.
   *
   * @param value Time interval in `ms`
   */
  retryInterval(value: number): void;

  /**
   * How many time to retry a failed testcase inside this test suite
   */
  retries(n: number): void;

  /**
   * How many times to retry the current test suite in case of an
   * assertion failure or error
   */
  suiteRetries(n: number): void;
}

export type ExtendDescribeThis<T> = DescribeInstance & {
  [P in keyof T]?: T[P];
};

interface SuiteFunction {
  (title: string, fn?: (this: DescribeInstance) => void): this;
  only: ExclusiveSuiteFunction;
  skip: PendingSuiteFunction;
}

interface ExclusiveSuiteFunction {
  (title: string, fn?: (this: DescribeInstance) => void): this;
}

interface PendingSuiteFunction {
  (title: string, fn?: (this: DescribeInstance) => void): this | void;
}

interface ExclusiveTestFunction {
  (fn: NormalFunc | AsyncFunc): this;
  (title: string, fn: NormalFunc | AsyncFunc): this;
}

interface PendingTestFunction {
  (fn: NormalFunc | AsyncFunc): this;
  (title: string, fn: NormalFunc | AsyncFunc): this;
}

type NormalFunc = (this: DescribeInstance, browser: NightwatchBrowser) => void;
type AsyncFunc = (
  this: DescribeInstance,
  browser: NightwatchBrowser
) => PromiseLike<any>;
interface TestFunction {
  (fn: NormalFunc | AsyncFunc): this;
  (title: string, fn: NormalFunc | AsyncFunc): this;
  only: ExclusiveTestFunction;
  skip: PendingTestFunction;
  retries(n: number): void;
}

type NightwatchBddTestHookCallback = (
  this: DescribeInstance,
  browser: NightwatchBrowser,
  done: (err?: any) => void
) => void;

type NightwatchBddTestHook = (callback: NightwatchBddTestHookCallback) => void;

declare global {
  const describe: SuiteFunction;
  const xdescribe: PendingSuiteFunction;
  const context: SuiteFunction;
  const xcontext: PendingSuiteFunction;
  const test: TestFunction;
  const it: TestFunction;
  const xit: PendingTestFunction;
  const specify: TestFunction;
  const xspecify: PendingTestFunction;
  const before: NightwatchBddTestHook;
  const after: NightwatchBddTestHook;
  const beforeEach: NightwatchBddTestHook;
  const afterEach: NightwatchBddTestHook;
}

export interface NightwatchClient extends NightwatchClientObject {
  argv: { [key: string]: any };
  client: NightwatchClientObject;
  configLocateStrategy: "css selector" | "xpath";
  // TODO: Add missing properties, like:
  // elementLocator
  // httpOpts
  // initialCapabilities
  // queue
  // reporter
  unitTestingMode: boolean;
  usingCucumber: boolean;
}

export interface NightwatchClientObject {
  api: NightwatchAPI;
  options: NightwatchOptions;
  settings: NightwatchOptions;
  locateStrategy: LocateStrategy;
  // TODO: Add missing properties, like:
  // reporter: reporter
  // elementLocator
  sessionId: string | null;
}

export interface CreateClientParams {
  browserName?: string | null;
  headless?: boolean;
  silent?: boolean;
  output?: boolean;
  useAsync?: boolean;
  env?: string | null;
  timeout?: number | null;
  parallel?: boolean;
  reporter?: any;
  globals?: Partial<NightwatchGlobals>;
  devtools?: boolean;
  debug?: boolean;
  enable_global_apis?: boolean;
  config?: string;
  test_settings?: Partial<NightwatchOptions>;
}

export interface Nightwatch {
  /**
   * Internal method in Nightwatch.
   */
  cli(callback: () => void): void;

  /**
   * Internal method in Nightwatch.
   */
  client(settings: NightwatchOptions, reporter?: any, argv?: {}, skipInt?: boolean): this;

  /**
   * Internal method in Nightwatch.
   */
  CliRunner(argv?: {}): this; // TODO: return type is `CliRunner` instance.

  /**
   * Internal method in Nightwatch.
   */
  initClient(opts?: {}): this;

  /**
   * Internal method in Nightwatch.
   *
   * @deprecated
   */
  runner(argv?: {}, done?: () => void, settings?: {}): Promise<void>;

  /**
   * Internal method in Nightwatch.
   */
  runTests(testSource: string | string[], settings?: any, ...args: any[]): Promise<void>;

  /**
   * Creates a new Nightwatch client that can be used to create WebDriver sessions.
   *
   * @example
   * const Nightwatch = require('nightwatch');
   *
   * const client = Nightwatch.createClient({
   *   headless: true,
   *   output: true,
   *   silent: true, // set to false to enable verbose logging
   *   browserName: 'firefox', // can be either: firefox, chrome, safari, or edge
   *
   *   // set the global timeout to be used with waitFor commands and when retrying assertions/expects
   *   timeout: 10000,
   *
   *   // set the current test environment from the nightwatch config
   *   env: null,
   *
   *   // any additional capabilities needed
   *   desiredCapabilities: {
   *
   *   },
   *
   *   // can define/overwrite test globals here;
   *   // when using a third-party test runner only the global hooks onBrowserNavigate/onBrowserQuit are supported
   *   globals: {},
   *
   *   // when the test runner used supports running tests in parallel;
   *   // set to true if you need the webdriver port to be randomly generated
   *   parallel: false,
   *
   *   // All other Nightwatch config settings can be overwritten here, such as:
   *   disable_colors: false
   * });
   *
   * @see https://nightwatchjs.org/api/programmatic/#programmatic-api
   */
  createClient({
    headless,
    silent,
    output,
    useAsync,
    env,
    timeout,
    parallel,
    reporter,
    browserName,
    globals,
    devtools,
    debug,
    enable_global_apis,
    config,
    test_settings
  }?: CreateClientParams): NightwatchProgrammaticAPIClient;

  // TODO: add the following missing properties
  // Logger
  // element (only available after createClient is called)

  // Not adding named-exports (Namespaced API) here because those
  // would go away from Nightwatch interface after migrating to TypeScript,
  // because then named-exports will be exported directly instead
  // of first adding them to Nightwatch (default export).
  browser: NightwatchAPI;
  app: NightwatchAPI;
  by: typeof SeleniumBy;
  Capabilities: typeof Capabilities;
  Key: NightwatchKeys;
}

export interface NightwatchProgrammaticAPIClient {
  /**
   * Create a new browser session.
   *
   * Returns [NightwatchAPI](https://nightwatchjs.org/api/) object.
   *
   * @example
   * const browser = await client.launchBrowser();
   */
  launchBrowser(): Promise<NightwatchAPI>;

  /**
   * Update the initially specified capabilities.
   *
   * @example
   * client.updateCapabilities({
   *   testCapability: 'one, two, three'
   * });
   */
  updateCapabilities(value: {} | (() => {})): void;

  nightwatch_client: NightwatchClient;
  settings: NightwatchOptions;
  // TODO: 'transport' property missing
}

export type LocateStrategy =
  | 'class name'
  | 'css selector'
  | 'id'
  | 'name'
  | 'link text'
  | 'partial link text'
  | 'tag name'
  | 'xpath'
  // Appium-specific strategies
  | 'accessibility id'
  | '-android uiautomator'
  | '-ios predicate string'
  | '-ios class chain';

export type NightwatchLogTypes =
  | 'client'
  | 'driver'
  | 'browser'
  | 'server'
  | 'performance';

export interface SharedCommands extends ClientCommands, ElementCommands { }

export interface WindowPosition {
  x: number;
  y: number;
}

// tslint:disable-next-line
export interface NightwatchPosition extends WindowPosition { }

export interface WindowSize {
  height: number;
  width: number;
}

// tslint:disable-next-line
export interface NightwatchSize extends WindowSize { }

export type WindowSizeAndPosition = WindowPosition & WindowSize;

export type NightwatchSizeAndPosition = WindowSizeAndPosition;

export type WindowType = 'tab' | 'window';

export interface ChromiumClientCommands {
  /**
   * Mock the geolocation of the browser.
   *
   * Call without any arguments to reset the geolocation.
   *
   * @example
   *  describe('mock geolocation', function() {
   *    it('sets the geolocation to Tokyo, Japan and then resets it', () => {
   *      browser
   *        .setGeolocation({
   *          latitude: 35.689487,
   *          longitude: 139.691706,
   *          accuracy: 100
   *        })  // sets the geolocation to Tokyo, Japan
   *        .navigateTo('https://www.gps-coordinates.net/my-location')
   *        .pause(3000)
   *        .setGeolocation()  // resets the geolocation
   *        .navigateTo('https://www.gps-coordinates.net/my-location')
   *        .pause(3000);
   *    });
   *  });
   *
   * @see https://nightwatchjs.org/guide/network-requests/mock-geolocation.html
   */
  setGeolocation(
    coordinates?: { latitude: number; longitude: number; accuracy?: number },
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Override device mode/dimensions.
   *
   * @example
   *  describe('modify device dimensions', function() {
   *    it('modifies the device dimensions and then resets it', function() {
   *      browser
   *        .setDeviceDimensions({
   *          width: 400,
   *          height: 600,
   *          deviceScaleFactor: 50,
   *          mobile: true
   *        })
   *        .navigateTo('https://www.google.com')
   *        .pause(1000)
   *        .setDeviceDimensions()  // resets the device dimensions
   *        .navigateTo('https://www.google.com')
   *        .pause(1000);
   *    });
   *  });
   *
   * @see https://nightwatchjs.org/guide/mobile-web-testing/override-device-dimensions.html
   */
  setDeviceDimensions(
    metrics?: {
      width?: number;
      height?: number;
      deviceScaleFactor?: number;
      mobile?: boolean;
    },
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Get the performance metrics from the browser. Metrics collection
   * only begin after `enablePerformanceMetrics()` command is called.
   *
   * @returns A promise that contains metrics collected between the
   * last call to `enablePerformanceMetrics()` command and this command.
   *
   * @example
   *  describe('collect performance metrics', function() {
   *    it('enables the metrics collection, does some stuff and collects the metrics', function() {
   *      browser
   *        .enablePerformanceMetrics()
   *        .navigateTo('https://www.google.com')
   *        .getPerformanceMetrics((result) => {
   *          if (result.status === 0) {
   *            const metrics = result.value;
   *            console.log(metrics);
   *          }
   *        });
   *    });
   *  });
   *
   * @see https://web.dev/metrics/
   * @see https://pptr.dev/api/puppeteer.page.metrics/
   */
  getPerformanceMetrics(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<{ [metricName: string]: number }>
    ) => void
  ): Awaitable<this, { [metricName: string]: number }>;

  /**
   * Enable/disable the collection of performance metrics in the browser. Metrics
   * collection only begin after this command is called.
   *
   * @example
   *  describe('collect performance metrics', function() {
   *    it('enables the metrics collection, does some stuff and collects the metrics', function() {
   *      browser
   *        .enablePerformanceMetrics()
   *        .navigateTo('https://www.google.com')
   *        .getPerformanceMetrics((result) => {
   *          if (result.status === 0) {
   *            const metrics = result.value;
   *            console.log(metrics);
   *          }
   *        });
   *    });
   *  });
   *
   * @see https://web.dev/metrics/
   * @see https://pptr.dev/api/puppeteer.page.metrics/
   */
  enablePerformanceMetrics(
    enable?: boolean,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Take heap snapshot and save it as a `.heapsnapshot` file.
   * The saved snapshot file can then be loaded into Chrome
   * DevTools' Memory tab for inspection.
   *
   * The contents of the heap snapshot are also available in the `value`
   * property of the `result` argument passed to the callback, in
   * string-serialized JSON format.
   *
   * @returns A promise that contains heap snapshot in string-serialized
   * JSON format.
   *
   * @example
   *  describe('take heap snapshot', function() {
   *    it('takes heap snapshot and saves it as snap.heapsnapshot file', function() {
   *      browser
   *        .navigateTo('https://www.google.com')
   *        .takeHeapSnapshot('./snap.heapsnapshot');
   *    });
   *  });
   *
   * @see https://nightwatchjs.org/guide/running-tests/take-heap-snapshot.html
   */
  takeHeapSnapshot(
    heapSnapshotLocation?: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;

  captureNetworkRequests: NetworkNsCommands<this>['captureRequests'];

  mockNetworkResponse: NetworkNsCommands<this>['mockResponse'];

  setNetworkConditions: NetworkNsCommands<this>['setConditions'];

  captureBrowserConsoleLogs: LogsNsCommands<this>['captureBrowserConsoleLogs'];

  captureBrowserExceptions: LogsNsCommands<this>['captureBrowserExceptions'];
}

export interface ClientCommands extends ChromiumClientCommands {
  /**
   * Close the current window. This can be useful when you're working with multiple windows open (e.g. an OAuth login).
   * Uses `window` protocol command.
   *
   * @example
   * describe('closeWindow command demo' , function (result) {
   *   test('demo test', function () {
   *     browser.closeWindow();
   *   });
   * });
   * @see https://nightwatchjs.org/api/closeWindow.html
   *
   * @deprecated In favour of `.window.close()`.
   */
  closeWindow(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Sets the current window state to fullscreen.
   *
   * @example
   * module.exports = {
   *  'demo Test': function(browser) {
   *     browser.fullscreenWindow(function(result) {
   *       console.log(result);
   *     });
   *   },
   *
   *   'ES6 async demo Test': async function(browser) {
   *     const result = await browser.fullscreenWindow();
   *     console.log('result value is:', result.value);
   *   }
   * }
   * @see https://nightwatchjs.org/api/fullscreenWindow.html
   *
   * @deprecated In favour of `.window.fullscreen()`.
   */
  fullscreenWindow(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Hides the window in the system tray. If the window happens to be in fullscreen mode,
   * it is restored the normal state then it will be "iconified" - minimize or hide the window from the visible screen.
   *
   * @example
   * module.exports = {
   *  'demo Test': function(browser) {
   *     browser.minimizeWindow(function(result) {
   *       console.log(result);
   *     });
   *   },
   *
   *   'ES6 async demo Test': async function(browser) {
   *     const result = await browser.minimizeWindow();
   *     console.log('result value is:', result.value);
   *   }
   * }
   * @see https://nightwatchjs.org/api/minimizeWindow.html
   *
   * @deprecated In favour of `.window.minimize()`.
   */
  minimizeWindow(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Opens a new top-level browser window, which can be either a tab (default) or a separate new window.
   *
   * This command is only available for W3C Webdriver compatible browsers.
   *
   * @example
   * module.exports = {
   *  'demo Test': function(browser) {
   *     // open a new window tab (default)
   *     browser.openNewWindow(function(result) {
   *       console.log(result);
   *     });
   *
   *     // open a new window
   *     browser.openNewWindow('window', function(result) {
   *       console.log(result);
   *     });
   *   },
   *
   *   'ES6 async demo Test': async function(browser) {
   *     const result = await browser.openNewWindow();
   *     console.log('result value is:', result.value);
   *   }
   * }
   * @see https://nightwatchjs.org/api/openNewWindow.html
   *
   * @deprecated In favour of `.window.open()`.
   */
  openNewWindow(
    type?: WindowType,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Delete the cookie with the given name. This command is a no-op if there is no such cookie visible to the current page.
   *
   * @example
   * this.demoTest = function() {
   *   browser.deleteCookie("test_cookie", function() {
   *     // do something more in here
   *   });
   * }
   *
   * @see https://nightwatchjs.org/api/deleteCookie.html
   *
   * @deprecated In favour of `.cookies.delete()`.
   */
  deleteCookie(
    cookieName: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Delete all cookies visible to the current page.
   *
   * @example
   * this.demoTest = function() {
   *   browser.deleteCookies(function() {
   *     // do something more in here
   *   });
   * }
   *
   * @see https://nightwatchjs.org/api/deleteCookies.html
   *
   * @deprecated In favour of `.cookies.deleteAll()`.
   */
  deleteCookies(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Ends the session. Uses session protocol command.
   *
   * @example
   * this.demoTest = function () {
   *   browser.end();
   * };
   *
   * @see https://nightwatchjs.org/api/end.html
   */
  end(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Retrieve a single cookie visible to the current page. The cookie is returned as a cookie JSON object,
   * as defined [here](https://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object).
   *
   * Uses `cookie` protocol command.
   *
   * @example
   * this.demoTest = function() {
   *   browser.getCookie(name, function callback(result) {
   *     this.assert.equal(result.value, '123456');
   *     this.assert.equals(result.name, 'test_cookie');
   *   });
   * }
   *
   * @see https://nightwatchjs.org/api/getCookie.html
   *
   * @deprecated In favour of `.cookies.get()`.
   */
  getCookie(
    name: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<Cookie>
    ) => void
  ): Awaitable<this, Cookie>;

  /**
   * Retrieve all cookies visible to the current page. The cookies are returned as an array of cookie JSON object,
   * as defined [here](https://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object).
   *
   * Uses `cookie` protocol command.
   *
   * @example
   * this.demoTest = function() {
   *   browser.getCookies(function callback(result) {
   *     this.assert.equal(result.value.length, 1);
   *     this.assert.equals(result.value[0].name, 'test_cookie');
   *   });
   * }
   *
   * @see https://nightwatchjs.org/api/getCookies.html
   *
   * @deprecated In favour of `.cookies.getAll()`.
   */
  getCookies(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<Cookie[]>
    ) => void
  ): Awaitable<this, Cookie[]>;

  /**
   * Gets a log from Selenium.
   *
   * @example
   * this.demoTest = function() {
   *   this.getLog('browser', function(logEntriesArray) {
   *     console.log('Log length: ' + logEntriesArray.length);
   *     logEntriesArray.forEach(function(log) {
   *        console.log('[' + log.level + '] ' + log.timestamp + ' : ' + log.message);
   *      });
   *   });
   * };
   *
   * @see https://nightwatchjs.org/api/getLog.html
   */
  getLog(
    typestring: string,
    callback?: (this: NightwatchAPI, log: NightwatchLogEntry[]) => void
  ): Awaitable<this, NightwatchLogEntry[]>;

  /**
   * Gets the available log types. More info about log types in WebDriver can be found here: https://github.com/SeleniumHQ/selenium/wiki/Logging
   *
   * @example
   * this.demoTest = function() {
   *   this.getLogTypes(function(typesArray) {
   *     console.log(typesArray);
   *   });
   * };
   *
   * @see https://nightwatchjs.org/api/getLogTypes.html
   */
  getLogTypes(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchLogTypes[]
    ) => void
  ): Awaitable<
    this,
    NightwatchLogTypes[]
  >;

  /**
   * Retrieve the URL of the current page.
   *
   * @example
   * describe('Navigation commands demo', function() {
   *   test('demoTest', function(browser) {
   *     // navigate to new url:
   *     browser.navigateTo('https://nightwatchjs.org');
   *
   *     // Retrieve to url with callback:
   *     browser.getCurrentUrl(function(result) {
   *       console.log(result.value);
   *     });
   *   });
   *
   *   test('demoTestAsync', async function(browser) {
   *     const currentUrl = await browser.navigateTo('https://nightwatchjs.org').getCurrentUrl();
   *     console.log('currentUrl:', currentUrl); // will print 'https://nightwatchjs.org'
   *   });
   *
   * });
   *
   *  @see https://nightwatchjs.org/api/getCurrentUrl.html
   */
  getCurrentUrl(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;

  /**
   * Returns the title of the current page. Uses title protocol command.
   *
   * @example
   *  this.demoTest = function () {
   *    browser.getTitle(function(title) {
   *      this.assert.equal(typeof title, 'string');
   *      this.assert.equal(title, 'Nightwatch.js');
   *    });
   *  };
   *
   * @see https://nightwatchjs.org/api/getTitle.html
   */
  getTitle(
    callback?: (this: NightwatchAPI, result: string) => void
  ): Awaitable<this, string>;

  /**
   * Navigate to a new URL. This method will also call the `onBrowserNavigate()` test global,
   * right after the page is loaded.
   *
   * @example
   *  describe('Navigation commands demo', function() {
   *    test('demoTest', function(browser) {
   *      // navigate to new url:
   *      browser.navigateTo('https://nightwatchjs.org');
   *
   *      // Retrieve to url with callback:
   *      browser.getCurrentUrl(function(result) {
   *        console.log(result.value);
   *      });
   *    });
   *
   *    test('demoTestAsync', async function(browser) {
   *      const currentUrl = await browser.navigateTo('https://nightwatchjs.org').getCurrentUrl();
   *      console.log('currentUrl:', currentUrl); // will print 'https://nightwatchjs.org'
   *    });
   *  });
   *
   *  @see https://nightwatchjs.org/api/navigateTo.html
   */
  navigateTo(
    url: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Ends the session and closes down the test WebDriver server, if one is running.
   * This is similar to calling the .end() command, but the former doesn't quit the WebDriver session.
   *
   * This command will also execute the `onBrowserQuit()` global, if one is defined.
   *
   * @example
   * this.demoTest = function (browser) {
   *   browser.quit(function(result) {
   *     console.log(result.value);
   *   });
   * }
   *
   * @see https://nightwatchjs.org/api/quit.html
   */
  quit(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * This command is an alias to url and also a convenience method when called without any arguments in the sense
   * that it performs a call to .url() with passing the value of `launch_url` field from the settings file.
   * Uses `url` protocol command.
   *
   * @example
   * this.demoTest = function () {
   *   browser.init();
   * };
   *
   * @see https://nightwatchjs.org/api/init.html
   */
  init(
    url?: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Utility command to load an external script into the page specified by url.
   *
   * @example
   * this.demoTest = function() {
   *   this.injectScript("{script-url}", function() {
   *     // we're all done here.
   *   });
   * };
   *
   * @see https://nightwatchjs.org/api/injectScript.html
   *
   * @deprecated In favour of `.document.injectScript()`.
   */
  injectScript(
    scriptUrl: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<WebElement>
    ) => void,
  ): Awaitable<this, WebElement>;
  injectScript(
    scriptUrl: string,
    id: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<WebElement>
    ) => void,
  ): Awaitable<this, WebElement>;

  /**
   * Utility command to test if the log type is available.
   *
   * @example
   * this.demoTest = function() {
   *   browser.isLogAvailable('browser', function(isAvailable) {
   *     // do something more in here
   *   });
   * }
   *
   * @see https://nightwatchjs.org/api/isLogAvailable.html
   */
  isLogAvailable(
    typeString: string,
    callback?: (this: NightwatchAPI, result: boolean) => void
  ): Awaitable<this, boolean>;

  /**
   * Maximizes the current window.
   *
   * @example
   *  this.demoTest = function () {
   *    browser.maximizeWindow();
   *  };
   *
   * @see https://nightwatchjs.org/api/maximizeWindow.html
   *
   * @deprecated In favour of `.window.maximize()`.
   */
  maximizeWindow(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Suspends the test for the given time in milliseconds. If the milliseconds argument is missing it will suspend the test indefinitely
   *
   * @example
   * this.demoTest = function () {
   *   browser.pause(1000);
   *   // or suspend indefinitely
   *   browser.pause();
   * };
   *
   * @see https://nightwatchjs.org/api/pause.html
   */
  pause(
    ms?: number,
    callback?: (this: NightwatchAPI) => void
  ): Awaitable<this, undefined>;

  /**
   * This command halts the test execution and provides users with a REPL interface where they can type
   * any of the available Nightwatch commands and the command will be executed in the running browser
   * in real-time.
   *
   * This can be used to debug why a certain command in not working as expected, find the correct
   * locators for your assertions or just play around with the available Nightwatch commands.
   *
   * @example
   * // async function is required while using the debug
   * // command to get the correct result as output.
   * this.demoTest = async function (browser) {
   *   browser.debug();
   *
   *   // with no auto-complete
   *   browser.debug({preview: false});
   *
   *   // with a timeout of 6000 ms (time for which the interface
   *   // would wait for a result).
   *   browser.debug({timeout: 6000})
   * };
   *
   * @see https://nightwatchjs.org/api/debug.html
   */
  debug(
    config?: { useGlobal?: boolean; preview?: boolean; timeout?: number },
    callback?: (this: NightwatchAPI) => void
  ): Awaitable<this, undefined>;

  /**
   * A simple perform command which allows access to the Nightwatch API in a callback. Can be useful if you want to read variables set by other commands.
   *
   * The callback signature can have up to two parameters.
   *  - no parameters: callback runs and perform completes immediately at the end of the execution of the callback.
   *  - one parameter: allows for asynchronous execution within the callback providing a done callback function for completion as the first argument.
   *  - two parameters: allows for asynchronous execution with the Nightwatch `api` object passed in as the first argument, followed by the done callback.
   *
   * @example
   * describe('perform example', function() {
   *   var elementValue;
   *
   *   it('basic perform', function(browser) {
   *     browser
   *       .getValue('.some-element', function(result) {
   *         elementValue = result.value;
   *       })
   *       // other stuff going on ...
   *
   *       // self-completing callback
   *       .perform(function() {
   *         console.log('elementValue', elementValue);
   *         // without any defined parameters, perform
   *         // completes immediately (synchronously)
   *       })
   *
   *       // returning a Promise
   *       .perform(async function() {
   *         // `this` can be used to directly access Nightwatch API
   *         const sessionId = await this.sessionId;
   *         console.log('session id', sessionId);
   *       })
   *
   *       // DEPRECATED: asynchronous completion using done
   *       .perform(function(done: (result: string) => void) {
   *         // potentially some async stuff going on
   *         // `this` can be used to directly access Nightwatch API
   *         this.getTitle((result) => {
   *           // when finished, call the done callback
   *           done(result.value);
   *         });
   *       })
   *
   *       // DEPRECATED: asynchronous completion including api (client)
   *       .perform(function(client: NightwatchAPI, done: () => void) {
   *         this.navigateTo('https://google.com/', () => {
   *           done();
   *         });
   *       });
   *   });
   *
   *   it('perform with async', function(browser) {
   *     const result = await browser.perform(async function() {
   *       // `this` can be used to directly access Nightwatch API
   *       const pageTitle = await this.getTitle();
   *
   *       return 100;
   *     });
   *     console.log('result:', result); // 100
   *   })
   * };
   */
  perform<ReturnValue>(
    callback: (this: NightwatchAPI) => ReturnValue | Promise<ReturnValue>
  ): Awaitable<this, ReturnValue>;
  perform<ReturnValue>(
    callback: (this: NightwatchAPI, client: NightwatchAPI, done: (result?: ReturnValue) => void) => void
  ): Awaitable<this, ReturnValue>;
  perform<ReturnValue>(
    callback: (this: NightwatchAPI, done: (result?: ReturnValue) => void) => void
  ): Awaitable<this, ReturnValue>;

  /**
   * Waits for a condition to evaluate to a "truthy" value. The condition may be specified by any function which
   * returns the value to be evaluated or a Promise to wait for.
   *
   * An optional wait time can be specified, otherwise the global waitForConditionTimeout value will be used.
   *
   * @example
   * describe('waitUntil Example', function() {
   *   it('demo Test', function(browser) {
   *     browser
   *       .url('https://nightwatchjs.org')
   *       .waitUntil(async function() {
   *         const title = await this.execute(function() {
   *           return document.title;
   *         });
   *
   *         return title === 'Nightwatch.js';
   *       }, 1000);
   *   });
   * });
   */
  waitUntil(
    conditionFn: (this: NightwatchAPI) => void,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<this, null>;
  waitUntil(
    conditionFn: (this: NightwatchAPI) => void,
    waitTimeMs: number,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<this, null>;
  waitUntil(
    conditionFn: (this: NightwatchAPI) => void,
    waitTimeMs: number,
    retryInterval: number,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<this, null>;
  waitUntil(
    conditionFn: (this: NightwatchAPI) => void,
    waitTimeMs: number,
    retryInterval: number,
    message: string,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<this, null>;

  /**
   * Resizes the current window.
   *
   * @example
   *  this.demoTest = function () {
   *    browser.resizeWindow(1000, 800);
   *  };
   *
   * @see https://nightwatchjs.org/api/resizeWindow.html
   *
   * @deprecated In favour of `.window.resize()`.
   */
  resizeWindow(
    width: number,
    height: number,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Take a screenshot of the current page and saves it as the given filename.
   *
   * @example
   *  this.demoTest = function (  ) {
   *    browser.saveScreenshot('/path/to/fileName.png');
   *  };
   *
   * @see https://nightwatchjs.org/api/saveScreenshot.html
   */
  saveScreenshot(
    fileName: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;

  /**
   * Set a cookie, specified as a cookie JSON object, as defined [here](https://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object).
   *
   * Uses `cookie` protocol command.
   *
   * @example
   * this.demoTest = function() {
   *   browser.setCookie({
   *     name     : "test_cookie",
   *     value    : "test_value",
   *     path     : "/", (Optional)
   *     domain   : "example.org", (Optional)
   *     secure   : false, (Optional)
   *     httpOnly : false, // (Optional)
   *     expiry   : 1395002765 // (Optional) time in seconds since midnight, January 1, 1970 UTC
   *   });
   * }
   *
   * @see https://nightwatchjs.org/api/setCookie.html
   *
   * @deprecated In favour of `.cookies.set()`.
   */
  setCookie(
    cookie: Cookie,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Sets the current window position.
   *
   * @example
   *  this.demoTest = function () {
   *    browser.setWindowPosition(0, 0);
   *  };
   *
   * @see https://nightwatchjs.org/api/setWindowPosition.html
   *
   * @deprecated In favour of `.window.setPosition()`.
   */
  setWindowPosition(
    offsetX: number,
    offsetY: number,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Change the [window rect](https://w3c.github.io/webdriver/#dfn-window-rect). This is defined as a dictionary of the `screenX`, `screenY`, `outerWidth` and `outerHeight` attributes of the window.
   *
   * Its JSON representation is the following:
   * - `x` - window's screenX attribute;
   * - `y` - window's screenY attribute;
   * - `width` - outerWidth attribute;
   * - `height` - outerHeight attribute.
   *
   * All attributes are in in CSS pixels. To change the window react, you can either specify `width` and `height`, `x` and `y` or all properties together.
   *
   * @example
   * module.exports = {
   *   'demo test .setWindowRect()': function() {
   *
   *      // Change the screenX and screenY attributes of the window rect.
   *      browser.setWindowRect({x: 500, y: 500});
   *
   *      // Change the width and height attributes of the window rect.
   *      browser.setWindowRect({width: 600, height: 300});
   *
   *      // Retrieve the attributes
   *      browser.setWindowRect(function(result) {
   *        console.log(result.value);
   *      });
   *   },
   *
   *   'setWindowRect ES6 demo test': async function() {
   *      await browser.setWindowRect({
   *        width: 600,
   *        height: 300,
   *        x: 100,
   *        y: 100
   *      });
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/setWindowRect.html
   *
   * @deprecated In favour of `.window.setRect()`.
   */
  setWindowRect(
    options: WindowSizeAndPosition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Sets the current window position.
   *
   * @example
   *  this.demoTest = function () {
   *    browser.setWindowPosition(0, 0);
   *  };
   *
   * @see https://nightwatchjs.org/api/setWindowSize.html
   *
   * @deprecated In favour of `.window.setSize()`.
   */
  setWindowSize(
    width: number,
    height: number,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Change focus to another window. The window to change focus to may be specified by its server assigned window handle, or by the value of its name attribute.
   *
   * To find out the window handle use `windowHandles` command
   *
   * @example
   *  this.demoTest = function () {
   *    browser.windowHandles(function(result) {
   *      const handle = result.value[0];
   *      browser.switchWindow(handle);
   *    });
   *  };
   *
   *  this.demoTestAsync = async function () {
   *    const result = await browser.windowHandles();
   *    const handle = result[0];
   *    browser.switchWindow(handle);
   *  };
   *
   * @alias switchToWindow
   *
   * @see https://nightwatchjs.org/api/switchWindow.html
   *
   * @deprecated In favour of `.window.switch()`.
   */
  switchWindow(
    handleOrName: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Change focus to another window. The window to change focus to may be specified by its server assigned window handle, or by the value of its name attribute.
   *
   * To find out the window handle use `windowHandles` command
   *
   * @example
   *  this.demoTest = function () {
   *    browser.windowHandles(function(result) {
   *      const handle = result.value[0];
   *      browser.switchToWindow(handle);
   *    });
   *  };
   *
   *  this.demoTestAsync = async function () {
   *    const result = await browser.windowHandles();
   *    const handle = result[0];
   *    browser.switchToWindow(handle);
   *  };
   *
   * @see https://nightwatchjs.org/api/switchToWindow.html
   *
   * @deprecated In favour of `.window.switchTo()`.
   */
  switchToWindow(
    handleOrName: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Change or get the [window rect](https://w3c.github.io/webdriver/#dfn-window-rect).
   * This is defined as a dictionary of the `screenX`, `screenY`, `outerWidth` and `outerHeight` attributes of the window.
   *
   * Its JSON representation is the following:
   * - `x` - window's screenX attribute;
   * - `y` - window's screenY attribute;
   * - `width` - outerWidth attribute;
   * - `height` - outerHeight attribute.
   *
   * All attributes are in in CSS pixels. To change the window react, you can either specify `width` and `height`, `x` and `y` or all properties together.
   *
   * @example
   * module.exports = {
   *   'demo test .getWindowRect()': function() {
   *      // Retrieve the attributes
   *      browser.getWindowRect(function(value) {
   *        console.log(value);
   *      });
   *   },
   *
   *   'getWindowRect ES6 demo test': async function() {
   *      const resultValue = await browser.getWindowRect();
   *      console.log('result value', resultValue);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/getWindowRect.html
   *
   * @deprecated In favour of `.window.getRect()`.
   */
  getWindowRect(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<WindowSizeAndPosition>
    ) => void
  ): Awaitable<this, WindowSizeAndPosition>;

  /**
   * Retrieves the current window size.
   *
   * For clients which are compatible with the [W3C Webdriver API](https://w3c.github.io/webdriver/), `getWindowSize` is an alias of `getWindowRect`.
   *
   * The `getWindowRect` command returns both dimensions and position of the window, using the `windowRect` protocol command.
   *
   * @example
   * module.exports = {
   *   'demo test .getWindowSize()': function() {
   *      // Retrieve the attributes
   *      browser.getWindowSize(function(value) {
   *        console.log(value);
   *      });
   *   },
   *
   *   'getWindowSize ES6 demo test': async function(browser) {
   *      const value = await browser.getWindowSize();
   *      console.log('value', value);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/getWindowSize.html
   *
   * @deprecated In favour of `.window.getRect()`.
   */
  getWindowSize(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<WindowSizeAndPosition>
    ) => void
  ): Awaitable<this, WindowSizeAndPosition>;

  /**
   * Retrieves the current window position.
   *
   * For clients which are compatible with the [W3C Webdriver API](https://w3c.github.io/webdriver/), `getWindowPosition` is an alias of `getWindowRect`.
   *
   * The `getWindowRect` command returns both dimensions and position of the window, using the `windowRect` protocol command.
   *
   * @example
   * module.exports = {
   *   'demo test .getWindowPosition()': function(browser) {
   *      // Retrieve the attributes
   *      browser.getWindowPosition(function(value) {
   *        console.log(value);
   *      });
   *   },
   *
   *   'getWindowPosition ES6 demo test': async function(browser) {
   *      const value = await browser.getWindowPosition();
   *      console.log('value', value);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/getWindowPosition.html
   *
   * @deprecated In favour of `.window.getPosition()`.
   */
  getWindowPosition(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<WindowPosition>
    ) => void
  ): Awaitable<this, WindowPosition>;

  /**
   * Returns the page source. Uses pageSource protocol command.
   *
   * @example
   *  this.demoTest = function (browser) {
   *    browser.pageSource(function(pageSource) {
   *      console.log(pageSource);
   *    });
   *  };
   *
   * @see https://nightwatchjs.org/api/pageSource.html
   *
   * @deprecated In favour of `.document.pageSource()`.
   */
  pageSource(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;

  /**
   * Convenience command that adds the specified hash (i.e. url fragment) to the current value of the `launch_url` as set in `nightwatch.json`.
   *
   * @example
   * this.demoTest = function () {
   *   browser.urlHash('#hashvalue');
   *   // or
   *   browser.urlHash('hashvalue');
   * };
   *
   * @see https://nightwatchjs.org/api/urlHash.html
   */
  urlHash(
    hash: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Sets the locate strategy for selectors to `css selector`, therefore every following selector needs to be specified as css.
   *
   * @example
   * this.demoTest = function () {
   *   browser
   *     .useCss() // we're back to CSS now
   *     .setValue('input[type=text]', 'nightwatch');
   * };
   *
   * @see https://nightwatchjs.org/api/useCss.html
   */
  useCss(callback?: (this: NightwatchAPI) => void): Awaitable<this, undefined>;

  /**
   * Sets the locate strategy for selectors to xpath, therefore every following selector needs to be specified as xpath.
   *
   * @example
   * this.demoTest = function () {
   *   browser
   *     .useXpath() // every selector now must be xpath
   *     .click("//tr[@data-recordid]/span[text()='Search Text']");
   * };
   *
   * @see https://nightwatchjs.org/api/useXpath.html
   */
  useXpath(
    callback?: (this: NightwatchAPI) => void
  ): Awaitable<this, undefined>;

  /**
   * Injects the [axe-core](https://github.com/dequelabs/axe-core) js library into the current page (using the `.executeScript()` command).
   * To be paired with `.axeRun()` to evaluate the axe-core accessibility rules.
   *
   * @example
   * describe('accessibility testing', function () {
   *   it('accessibility rule subset', function (browser) {
   *     browser
   *       .url('https://www.w3.org/WAI/demos/bad/after/home.html')
   *       .assert.titleEquals('Welcome to CityLights! [Accessible Home Page]')
   *       .axeInject()
   *       .axeRun('body', {
   *         runOnly: ['color-contrast', 'image-alt'],
   *       });
   *   });
   * });
   *
   * @see https://nightwatchjs.org/api/axeInject.html
   */
  axeInject(): Awaitable<this, null>;

  /**
   * Analyzes the current page against applied axe rules.
   *
   * @example
   * describe('accessibility testing', function () {
   *   it('accessibility rule subset', function (browser) {
   *     browser
   *       .url('https://www.w3.org/WAI/demos/bad/after/home.html')
   *       .assert.titleEquals('Welcome to CityLights! [Accessible Home Page]')
   *       .axeInject()
   *       .axeRun('body', {
   *         runOnly: ['color-contrast', 'image-alt'],
   *       });
   *   });
   *
   *   it('accessibility rule subset 2', function (browser) {
   *     browser
   *       .url('https://nightwatchjs.org')
   *       .axeInject()
   *       .axeRun(['#navBar', 'nav'], {
   *         rules: {
   *           'color-contrast': { enabled: false },
   *         }
   *       });
   *   });
   * });
   *
   * @param context - Defines the scope of the analysis, will cascade to child elements. See
   * [axe-core docs](https://github.com/dequelabs/axe-core/blob/master/doc/API.md#context-parameter) for more details.
   * @param options - Allows configuration of what rules will be run (accessibility standard or rules to enable/disable).
   * See [axe-core docs](https://www.deque.com/axe/core-documentation/api-documentation/#options-parameter) for more details.
   * @param callback - Optional callback function which is called with the results.
   *
   * @see {@link https://nightwatchjs.org/api/axeRun.html}
   * @see {@link https://github.com/dequelabs/axe-core/blob/master/doc/API.md#api-name-axerun}
   */
  axeRun(
    context?: unknown,
    options?: { [key: string]: any },
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<{ [key: string]: any }>
    ) => void
  ): Awaitable<this, { [key: string]: any }>;
}

export interface ElementCommands {
  /**
   * Will check, click, on an unchecked checkbox or radio input if not already checked.
   *
   * @example
   * module.exports = {
   *   demoTest(browser) {
   *     browser.check('input[type=checkbox]:not(:checked)');
   *
   *     browser.check('input[type=checkbox]:not(:checked)', function(result) {
   *       console.log('Check result', result);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.check('css selector', 'input[type=checkbox]:not(:checked)');
   *
   *     // with selector object - see https://nightwatchjs.org/guide#element-properties
   *     browser.check({
   *       selector: 'input[type=checkbox]:not(:checked)',
   *       index: 1,
   *       suppressNotFoundErrors: true
   *     });
   *
   *     browser.check({
   *       selector: 'input[type=checkbox]:not(:checked)',
   *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
   *     });
   *   },
   *
   *   demoTestAsync: async function(browser) {
   *     const result = await browser.check('input[type=checkbox]:not(:checked)');
   *     console.log('Check result', result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/check.html
   */
  check(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  check(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  /**
   * Clear a textarea or a text input element's value.
   * Starting with v1.1 `clearValue()` will wait for the element to be present (until the specified timeout).
   *
   * If the element is not found, an error is thrown which will cause the test to fail.
   * Starting with `v1.2` you can suppress element not found errors by specifying the `suppressNotFoundErrors` flag.
   *
   * @example
   *   describe('clearValue Command demo', function() {
   *     test('demo test', function() {
   *       browser.clearValue('#login input[type=text]');
   *
   *       browser.clearValue('#login input[type=text]', function(result) {
   *         console.log('clearValue result', result);
   *       });
   *
   *       // with explicit locate strategy
   *       browser.clearValue('css selector', '#login input[type=text]');
   *
   *       // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *       browser.clearValue({
   *         selector: '#login input[type=text]',
   *         index: 1,
   *         suppressNotFoundErrors: true
   *       });
   *
   *       browser.clearValue({
   *         selector: '#login input[type=text]',
   *         timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
   *       });
   *
   *     });
   *
   *   });
   *
   * @see https://nightwatchjs.org/api/clearValue.html
   */
  clearValue(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  clearValue(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Simulates a click event on the given DOM element.
   * The element is scrolled into view if it is not already pointer-interactable.
   * See the WebDriver specification for <a href="https://www.w3.org/TR/webdriver/#element-interactability" target="_blank">element interactability</a>.
   *
   * @example
   * module.exports = {
   *   demoTest() {
   *     browser.click('#main ul li a.first');
   *
   *     browser.click('#main ul li a.first', function(result) {
   *       console.log('Click result', result);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.click('css selector', '#main ul li a.first');
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.click({
   *       selector: '#main ul li a',
   *       index: 1,
   *       suppressNotFoundErrors: true
   *     });
   *
   *     browser.click({
   *       selector: '#main ul li a.first',
   *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
   *     });
   *   },
   *
   *   demoTestAsync: async function(browser) {
   *     const result = await browser.click('#main ul li a.first');
   *     console.log('Click result', result);
   *   }
   * }
   *
   *
   * @see https://nightwatchjs.org/api/click.html
   */
  click(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  click(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Retrieve the value of an attribute for a given DOM element.
   *
   * @example
   * module.exports = {
   *   demoTest() {
   *     browser.getAttribute('#main ul li a.first', 'href', function(result) {
   *       console.log('result', result);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.getAttribute('css selector', '#main ul li a.first', 'href', function(result) {
   *       console.log('result', result);
   *     });
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.getAttribute({
   *       selector: '#main ul li a.first',
   *       index: 1,
   *       suppressNotFoundErrors: true
   *     }, 'href', function(result) {
   *       console.log('result', result);
   *     });
   *   },
   *
   *   demoTestAsync: async function(browser) {
   *     const result = await browser.getAttribute('#main ul li a.first', 'href');
   *     console.log('attribute', result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/getAttribute.html
   */
  getAttribute(
    selector: Definition,
    attribute: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string | null>
    ) => void
  ): Awaitable<this, string | null>;
  getAttribute(
    using: LocateStrategy,
    selector: Definition,
    attribute: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string | null>
    ) => void
  ): Awaitable<this, string | null>;

  /**
   * Retrieve the value of a css property for a given DOM element.
   *
   * @example
   * module.exports = {
   *   demoTest() {
   *     browser.getCssProperty('#main ul li a.first', 'display', function(result) {
   *       console.log('result', result);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.getCssProperty('css selector', '#main ul li a.first', 'display', function(result) {
   *       console.log('result', result);
   *     });
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.getCssProperty({
   *       selector: '#main ul li a.first',
   *       index: 1,
   *       suppressNotFoundErrors: true
   *     }, 'display', function(result) {
   *       console.log('result', result);
   *     });
   *   },
   *
   *   demoTestAsync: async function(browser) {
   *     const result = await browser.getCssProperty('#main ul li a.first', 'display');
   *     console.log('display', result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/getCssProperty.html
   */
  getCssProperty(
    selector: Definition,
    cssProperty: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;
  getCssProperty(
    using: LocateStrategy,
    selector: Definition,
    cssProperty: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;

  /**
   * Determine an element's size in pixels. For W3C Webdriver compatible clients (such as GeckoDriver), this command is equivalent to `getLocation` and both return
   * the dimensions and coordinates of the given element:
   * - x: X axis position of the top-left corner of the element, in CSS pixels
   * - y: Y axis position of the top-left corner of the element, in CSS pixels
   * - height: Height of the element’s bounding rectangle in CSS pixels;
   * - width: Width of the web element’s bounding rectangle in CSS pixels.
   *
   * @example
   * module.exports = {
   *   demoTest() {
   *     browser.getElementSize('#login', function(result) {
   *       console.log('result', result);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.getElementSize('css selector', '#login', function(result) {
   *       console.log('result', result);
   *     });
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.getElementSize({
   *       selector: '#login',
   *       index: 1,
   *       suppressNotFoundErrors: true
   *     }, function(result) {
   *       console.log('result', result);
   *     });
   *   },
   *
   *   demoTestAsync: async function(browser) {
   *     const result = await browser.getElementSize('#login');
   *     console.log('classList', result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/getElementSize.html
   */
  getElementSize(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<NightwatchSizeAndPosition>
    ) => void
  ): Awaitable<this, NightwatchSizeAndPosition>;
  getElementSize(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<NightwatchSizeAndPosition>
    ) => void
  ): Awaitable<this, NightwatchSizeAndPosition>;

  /**
   * Determine an element's location on the page. The point (0, 0) refers to the upper-left corner of the page. The element's coordinates are returned as a JSON object with x and y properties.
   *
   * For W3C Webdriver compatible clients (such as GeckoDriver), this command is equivalent to `getElementSize` and both return
   * the dimensions and coordinates of the given element:
   * - x: X axis position of the top-left corner of the element, in CSS pixels
   * - y: Y axis position of the top-left corner of the element, in CSS pixels
   * - height: Height of the element’s bounding rectangle in CSS pixels;
   * - width: Width of the web element’s bounding rectangle in CSS pixels.
   *
   * @example
   * module.exports = {
   *   demoTest() {
   *     browser.getLocation('#login', function(result) {
   *       console.log('result', result);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.getLocation('css selector', '#login', function(result) {
   *       console.log('result', result);
   *     });
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.getLocation({
   *       selector: '#login',
   *       index: 1,
   *       suppressNotFoundErrors: true
   *     }, function(result) {
   *       console.log('result', result);
   *     });
   *   },
   *
   *   demoTestAsync: async function(browser) {
   *     const result = await browser.getLocation('#login');
   *     console.log('location', result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/getLocation.html
   */
  getLocation(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<NightwatchSizeAndPosition>
    ) => void
  ): Awaitable<this, NightwatchSizeAndPosition>;
  getLocation(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<NightwatchSizeAndPosition>
    ) => void
  ): Awaitable<this, NightwatchSizeAndPosition>;

  /**
   * Determine an element's location on the screen once it has been scrolled into view.
   *
   * @example
   * this.demoTest = function () {
   *   browser.getLocationInView("#main ul li a.first", function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value.x, 200);
   *     this.assert.equal(result.value.y, 200);
   *   });
   * };
   *
   * @see https://nightwatchjs.org/api/getLocationInView.html
   *
   * @deprecated This is JSON Wire Protocol command and is no longer supported.
   */
  getLocationInView(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<NightwatchPosition>
    ) => void
  ): Awaitable<this, NightwatchPosition>;
  getLocationInView(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<NightwatchPosition>
    ) => void
  ): Awaitable<this, NightwatchPosition>;

  /**
   * Query for an element's tag name.
   *
   * @example
   * module.exports = {
   *   demoTest() {
   *     browser.getTagName('#login', function(result) {
   *       console.log('result', result);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.getTagName('css selector', '#login', function(result) {
   *       console.log('result', result);
   *     });
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.getTagName({
   *       selector: '#login',
   *       index: 1,
   *       suppressNotFoundErrors: true
   *     }, function(result) {
   *       console.log('result', result);
   *     });
   *   },
   *
   *   demoTestAsync: async function(browser) {
   *     const result = await browser.getTagName('#login');
   *     console.log('tagName', result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/getTagName.html
   */
  getTagName(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;
  getTagName(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;

  /**
   * Returns the visible text for the element.
   *
   * @example
   * module.exports = {
   *   demoTest() {
   *     browser.getText('#main ul li a.first', function(result) {
   *       this.assert.equal(typeof result, 'object);
   *       this.assert.strictEqual(result.status, 0); // only when using Selenium / JSONWire
   *       this.assert.equal(result.value, 'nightwatchjs.org');
   *     });
   *
   *     // with explicit locate strategy
   *     browser.getText('css selector', '#main ul li a.first', function(result) {
   *       console.log('getText result', result.value);
   *     });
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.getText({
   *       selector: '#main ul li a',
   *       index: 1
   *     }, function(result) {
   *       console.log('getText result', result.value);
   *     });
   *
   *     browser.getText({
   *       selector: '#main ul li a.first',
   *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
   *     }, function(result) {
   *       console.log('getText result', result.value);
   *     });
   *   },
   *
   *   demoTestAsync: async function() {
   *     const result = await browser.getText('#main ul li a.first');
   *     console.log('getText result', result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/getText.html
   */
  getText(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;
  getText(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;

  /**
   * Returns a form element current value.
   *
   * @example
   * module.exports = {
   *   demoTest() {
   *     browser.getValue('#login input[type=text]', function(result) {
   *       console.log('result', result);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.getValue('css selector', '#login input[type=text]', function(result) {
   *       console.log('result', result);
   *     });
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.getValue({
   *       selector: '#login input[type=text]',
   *       index: 1,
   *       suppressNotFoundErrors: true
   *     }, function(result) {
   *       console.log('result', result);
   *     });
   *   },
   *
   *   demoTestAsync: async function() {
   *     const result = await browser.getValue('#login input[type=text]');
   *     console.log('Value', result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/getValue.html
   */
  getValue(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;
  getValue(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;

  /**
   * Determine if an element is currently displayed.
   *
   * @example
   * module.exports = {
   *   demoTest() {
   *     browser.isVisible('#main ul li a.first', function(result) {
   *       this.assert.equal(typeof result, "object");
   *       this.assert.equal(result.status, 0);
   *       this.assert.equal(result.value, true);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.isVisible('css selector', '#main ul li a.first');
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.isVisible({
   *       selector: '#main ul li a',
   *       index: 1,
   *       suppressNotFoundErrors: true
   *     });
   *
   *     browser.isVisible({
   *       selector: '#main ul li a.first',
   *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
   *     });
   *   },
   *
   *   demoTestAsync: async function() {
   *     const result = await browser.isVisible('#main ul li a.first');
   *     console.log('isVisible result', result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/isVisible.html
   */
  isVisible(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<boolean>
    ) => void
  ): Awaitable<this, boolean>;
  isVisible(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<boolean>
    ) => void
  ): Awaitable<this, boolean>;

  /**
   * Determines if an element is present in the DOM.
   *
   * @example
   * module.exports = {
   *   demoTest(browser) {
   *     browser.isPresent('#main ul li a.first', function(result) {
   *       this.assert.equal(typeof result, "object");
   *       this.assert.equal(result.status, 0);
   *       this.assert.equal(result.value, true);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.isPresent('css selector', '#main ul li a.first');
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.isPresent({
   *       selector: '#main ul li a',
   *       index: 1,
   *     });
   *
   *     browser.isPresent({
   *       selector: '#main ul li a.first',
   *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
   *     });
   *   },
   *
   *   demoTestAsync: async function(browser) {
   *     const result = await browser.isPresent('#main ul li a.first');
   *     console.log('isPresent result', result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/isPresent.html
   */
  isPresent(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<boolean>
    ) => void
  ): Awaitable<this, boolean>;
  isPresent(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<boolean>
    ) => void
  ): Awaitable<this, boolean>;

  /**
   * Move the mouse by an offset of the specified element. If an element is provided but no offset, the mouse will be moved to the center of the element.
   * If the element is not visible, it will be scrolled into view.
   *
   * @example
   * this.demoTest = function () {
   *   browser.moveToElement('#main', 10, 10);
   * };
   *
   * @see https://nightwatchjs.org/api/moveToElement.html
   */
  moveToElement(
    selector: Definition,
    xoffset: number,
    yoffset: number,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  moveToElement(
    using: LocateStrategy,
    selector: Definition,
    xoffset: number,
    yoffset: number,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Sends some text to an element. Can be used to set the value of a form element or to send a sequence of key strokes to an element. Any UTF-8 character may be specified.
   *
   * From Nightwatch v2, **setValue** also clears the existing value of the element by calling the **clearValue()** beforehand.
   *
   * An object map with available keys and their respective UTF-8 characters, as defined on [W3C WebDriver draft spec](https://www.w3.org/TR/webdriver/#character-types),
   * is loaded onto the main Nightwatch instance as `browser.Keys`.
   *
   * @example
   * // send some simple text to an input
   * this.demoTest = function () {
   *   browser.setValue('input[type=text]', 'nightwatch');
   * };
   * //
   * // send some text to an input and hit enter.
   * this.demoTest = function () {
   *   browser.setValue('input[type=text]', ['nightwatch', browser.Keys.ENTER]);
   * };
   *
   * @see https://nightwatchjs.org/api/setValue.html
   */
  setValue(
    selector: Definition,
    inputValue: string | string[],
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  setValue(
    using: LocateStrategy,
    selector: Definition,
    inputValue: string | string[],
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Types a key sequence on the DOM element. Can be used to send a sequence of key strokes to an element.
   * Any UTF-8 character may be specified.
   *
   * **sendKeys** does not clear the existing value of the element. To do so, use **setValue()** instead.
   *
   * An object map with available keys and their respective UTF-8 characters,
   * as defined on [W3C WebDriver draft spec](https://www.w3.org/TR/webdriver/#character-types),
   * is loaded onto the main Nightwatch instance as `browser.Keys`.
   *
   * @example
   * // send some simple text to an input
   * this.demoTest = function () {
   *   browser.sendKeys('input[type=text]', 'nightwatch');
   * };
   * //
   * // send some text to an input and hit enter.
   * this.demoTest = function () {
   *   browser.sendKeys('input[type=text]', ['nightwatch', browser.Keys.ENTER]);
   * };
   *
   * @see https://nightwatchjs.org/api/sendKeys.html
   */
  sendKeys(
    selector: Definition,
    inputValue: string | string[],
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  sendKeys(
    using: LocateStrategy,
    selector: Definition,
    inputValue: string | string[],
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Submit a FORM element. The submit command may also be applied to any element that is a descendant of a FORM element. Uses `submit` protocol command.
   *
   * @example
   * this.demoTest = function () {
   *   browser.submitForm('form.login');
   * };
   *
   * @see https://nightwatchjs.org/api/submitForm.html
   */
  submitForm(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  submitForm(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Opposite of `waitForElementPresent`. Waits a given time in milliseconds (default 5000ms)
   * for an element to be not present (i.e. removed) in the page before performing
   * any other commands or assertions.
   * If the element is still present after the specified amount of time, the test fails.
   *
   * You can change the polling interval by defining a `waitForConditionPollInterval` property (in milliseconds) in as a global property in your `nightwatch.json` or in your external globals file.
   * Similarly, a default timeout can be specified as a global `waitForConditionTimeout` property (in milliseconds).
   *
   * @returns `null` if element not found, `Error` otherwise.
   *
   * @example
   * // 'message' should always be the last argument (if provided).
   * // 'callback' should only be second-last to the 'message' argument, otherwise always last.
   * module.exports = {
   *  'demo Test': function() {
   *     // with default implicit timeout of 5000ms (can be overwritten in settings under 'globals.waitForConditionTimeout')
   *     browser.waitForElementNotPresent('#dialog');
   *
   *     // specify the locate strategy (css selector/xpath) as the first argument
   *     browser.waitForElementNotPresent('css selector', '#dialog');
   *
   *     // with explicit timeout (in milliseconds)
   *     browser.waitForElementNotPresent('#dialog', 1000);
   *
   *     // continue if failed
   *     browser.waitForElementNotPresent('#dialog', 1000, false);
   *
   *     // with callback
   *     browser.waitForElementNotPresent('#dialog', 1000, function() {
   *       // do something while we're here
   *     });
   *
   *     // with custom output message - the locate strategy is required
   *     browser.waitForElementNotPresent('css selector', '#dialog', 'The dialog container is removed.');
   *
   *     // with custom Spanish message
   *     browser.waitForElementNotPresent('#dialog', 1000, 'elemento %s no era presente en %d ms');
   *
   *     // many combinations possible - the message is always the last argument
   *     browser.waitForElementNotPresent('#dialog', 1000, false, function() {}, 'elemento %s no era presente en %d ms');
   *   },
   *
   *   'demo Test with selector objects': function() {
   *      browser.waitForElementNotPresent({
   *        selector: '#dialog',
   *        timeout: 1000
   *      });
   *
   *      browser.waitForElementNotPresent({
   *        selector: '#dialog',
   *        locateStrategy: 'css selector'
   *      }, 'Custom output message');
   *
   *      browser.waitForElementNotPresent({
   *        selector: '.container',
   *        index: 2,
   *        retryInterval: 100,
   *        abortOnFailure: true
   *      });
   *   }
   *
   *   'page object demo Test': function () {
   *      var nightwatch = browser.page.nightwatch();
   *      nightwatch
   *        .navigate()
   *        .assert.titleContains('Nightwatch.js');
   *
   *      nightwatch.waitForElementNotPresent('@dialogContainer', function(result) {
   *        console.log(result);
   *      });
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/waitForElementNotPresent.html
   * @since v0.4.0
   */
  waitForElementNotPresent(
    selector: Definition,
    timeoutOrCallbackOrMessage?: number | NightwatchGenericCallback<null | ElementResult[]> | string,
    pollIntervalOrAbortOnFailureOrCallbackOrMessage?: number | boolean | NightwatchGenericCallback<null | ElementResult[]> | string,
    abortOnFailureOrCallbackOrMessage?: boolean | NightwatchGenericCallback<null | ElementResult[]> | string,
    callbackOrMessage?: NightwatchGenericCallback<null | ElementResult[]> | string,
    message?: string
  ): Awaitable<this, null | Error>;
  waitForElementNotPresent(
    using: LocateStrategy,
    selector: Definition,
    timeoutOrCallbackOrMessage?: number | NightwatchGenericCallback<null | ElementResult[]> | string,
    pollIntervalOrAbortOnFailureOrCallbackOrMessage?: number | boolean | NightwatchGenericCallback<null | ElementResult[]> | string,
    abortOnFailureOrCallbackOrMessage?: boolean | NightwatchGenericCallback<null | ElementResult[]> | string,
    callbackOrMessage?: NightwatchGenericCallback<null | ElementResult[]> | string,
    message?: string
  ): Awaitable<this, null | Error>;

  /**
   * Opposite of `waitForElementVisible`. Waits a given time in milliseconds (default 5000ms)
   * for an element to be not visible (i.e. hidden but existing) in the page before
   * performing any other commands or assertions.
   * If the element fails to be hidden in the specified amount of time, the test fails.
   *
   * You can change the polling interval by defining a `waitForConditionPollInterval` property (in milliseconds) in as a global property in your `nightwatch.json` or in your external globals file.
   * Similarly, a default timeout can be specified as a global `waitForConditionTimeout` property (in milliseconds).
   *
   * @returns `false` if element not visible, `Error` otherwise.
   *
   * @example
   * // 'message' should always be the last argument (if provided).
   * // 'callback' should only be second-last to the 'message' argument, otherwise always last.
   * module.exports = {
   *  'demo Test': function() {
   *     // with default implicit timeout of 5000ms (can be overwritten in settings under 'globals.waitForConditionTimeout')
   *     browser.waitForElementNotVisible('#dialog');
   *
   *     // specify the locate strategy (css selector/xpath) as the first argument
   *     browser.waitForElementNotVisible('css selector', '#dialog');
   *
   *     // with explicit timeout (in milliseconds)
   *     browser.waitForElementNotVisible('#dialog', 1000);
   *
   *     // continue if failed
   *     browser.waitForElementNotVisible('#dialog', 1000, false);
   *
   *     // with callback
   *     browser.waitForElementNotVisible('#dialog', 1000, function() {
   *       // do something while we're here
   *     });
   *
   *     // with custom output message - the locate strategy is required
   *     browser.waitForElementNotVisible('css selector', '#dialog', 'The dialog container is not visible.');
   *
   *     // with custom Spanish message
   *     browser.waitForElementNotVisible('#dialog', 1000, 'elemento %s no era visible en %d ms');
   *
   *     // many combinations possible - the message is always the last argument
   *     browser.waitForElementNotVisible('#dialog', 1000, false, function() {}, 'elemento %s no era visible en %d ms');
   *   },
   *
   *   'demo Test with selector objects': function() {
   *      browser.waitForElementNotVisible({
   *        selector: '#dialog',
   *        timeout: 1000
   *      });
   *
   *      browser.waitForElementNotVisible({
   *        selector: '#dialog',
   *        locateStrategy: 'css selector'
   *      }, 'Custom output message');
   *
   *      browser.waitForElementNotVisible({
   *        selector: '.container',
   *        index: 2,
   *        retryInterval: 100,
   *        abortOnFailure: true
   *      });
   *   }
   *
   *   'page object demo Test': function () {
   *      var nightwatch = browser.page.nightwatch();
   *      nightwatch
   *        .navigate()
   *        .assert.titleContains('Nightwatch.js');
   *
   *      nightwatch.waitForElementNotVisible('@mainDialog', function(result) {
   *        console.log(result);
   *      });
   *   }
   * }
   *
   * @since v0.4.0
   * @see https://nightwatchjs.org/api/waitForElementNotVisible.html
   */
  waitForElementNotVisible(
    selector: Definition,
    timeoutOrCallbackOrMessage?: number | NightwatchGenericCallback<boolean> | string,
    pollIntervalOrAbortOnFailureOrCallbackOrMessage?: number | boolean | NightwatchGenericCallback<boolean> | string,
    abortOnFailureOrCallbackOrMessage?: boolean | NightwatchGenericCallback<boolean> | string,
    callbackOrMessage?: NightwatchGenericCallback<boolean> | string,
    message?: string
  ): Awaitable<this, false | Error>;
  waitForElementNotVisible(
    using: LocateStrategy,
    selector: Definition,
    timeoutOrCallbackOrMessage?: number | NightwatchGenericCallback<boolean> | string,
    pollIntervalOrAbortOnFailureOrCallbackOrMessage?: number | boolean | NightwatchGenericCallback<boolean> | string,
    abortOnFailureOrCallbackOrMessage?: boolean | NightwatchGenericCallback<boolean> | string,
    callbackOrMessage?: NightwatchGenericCallback<boolean> | string,
    message?: string
  ): Awaitable<this, false | Error>;

  /**
   * Waits a given time in milliseconds (default 5000ms) for an element to be present in the page before performing any other commands or assertions.
   * If the element fails to be present in the specified amount of time, the test fails. You can change this by setting `abortOnFailure` to `false`.
   *
   * You can change the polling interval by defining a `waitForConditionPollInterval` property (in milliseconds) in as a global property in your `nightwatch.json` or in your external globals file.
   * Similarly, the default timeout can be specified as a global `waitForConditionTimeout` property (in milliseconds).
   *
   * @returns `ElementResult[]` if element is found, `Error` otherwise.
   *
   * @example
   * // 'message' should always be the last argument (if provided).
   * // 'callback' should only be second-last to the 'message' argument, otherwise always last.
   * module.exports = {
   *  'demo Test': function() {
   *     // with default implicit timeout of 5000ms (can be overwritten in settings under 'globals.waitForConditionTimeout')
   *     browser.waitForElementPresent('#index-container');
   *
   *     // specify the locate strategy (css selector/xpath) as the first argument
   *     browser.waitForElementPresent('css selector', '#index-container');
   *
   *     // with explicit timeout (in milliseconds)
   *     browser.waitForElementPresent('#index-container', 1000);
   *
   *     // continue if failed
   *     browser.waitForElementPresent('#index-container', 1000, false);
   *
   *     // with callback
   *     browser.waitForElementPresent('#index-container', 1000, function() {
   *       // do something while we're here
   *     });
   *
   *     // with custom output message - the locate strategy is required
   *     browser.waitForElementPresent('css selector', '#index-container', 'The index container is found.');
   *
   *     // with custom Spanish message
   *     browser.waitForElementPresent('#index-container', 1000, 'elemento %s no era presente en %d ms');
   *
   *     // many combinations possible - the message is always the last argument
   *     browser.waitForElementPresent('#index-container', 1000, false, function() {}, 'elemento %s no era presente en %d ms');
   *   },
   *
   *   'demo Test with selector objects': function() {
   *      browser.waitForElementPresent({
   *        selector: '#index-container',
   *        timeout: 1000
   *      });
   *
   *      browser.waitForElementPresent({
   *        selector: '#index-container',
   *        locateStrategy: 'css selector'
   *      }, 'Custom output message');
   *
   *      browser.waitForElementPresent({
   *        selector: '.container',
   *        index: 2,
   *        retryInterval: 100,
   *        abortOnFailure: true
   *      });
   *   }
   *
   *   'page object demo Test': function () {
   *      var nightwatch = browser.page.nightwatch();
   *      nightwatch
   *        .navigate()
   *        .assert.titleContains('Nightwatch.js');
   *
   *      nightwatch.waitForElementPresent('@featuresList', function(result) {
   *        console.log(result);
   *      });
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/waitForElementPresent.html
   */
  waitForElementPresent(
    selector: Definition,
    timeoutOrCallbackOrMessage?: number | NightwatchGenericCallback<null | ElementResult[]> | string,
    pollIntervalOrAbortOnFailureOrCallbackOrMessage?: number | boolean | NightwatchGenericCallback<null | ElementResult[]> | string,
    abortOnFailureOrCallbackOrMessage?: boolean | NightwatchGenericCallback<null | ElementResult[]> | string,
    callbackOrMessage?: NightwatchGenericCallback<null | ElementResult[]> | string,
    message?: string
  ): Awaitable<this, ElementResult[] | Error>;
  waitForElementPresent(
    using: LocateStrategy,
    selector: Definition,
    timeoutOrCallbackOrMessage?: number | NightwatchGenericCallback<null | ElementResult[]> | string,
    pollIntervalOrAbortOnFailureOrCallbackOrMessage?: number | boolean | NightwatchGenericCallback<null | ElementResult[]> | string,
    abortOnFailureOrCallbackOrMessage?: boolean | NightwatchGenericCallback<null | ElementResult[]> | string,
    callbackOrMessage?: NightwatchGenericCallback<null | ElementResult[]> | string,
    message?: string
  ): Awaitable<this, ElementResult[] | Error>;

  /**
   * Waits a given time in milliseconds for an element to be visible in the page before performing any other commands or assertions.
   *
   * If the element fails to be present and visible in the specified amount of time, the test fails. You can change this by setting `abortOnFailure` to `false`.
   *
   * You can change the polling interval by defining a `waitForConditionPollInterval` property (in milliseconds) in as a global property in your `nightwatch.json` or in your external globals file.
   *
   * Similarly, a default timeout can be specified as a global `waitForConditionTimeout` property (in milliseconds).
   *
   * @returns `true` is element is visible, `Error` otherwise.
   *
   * @example
   * // 'message' should always be the last argument (if provided).
   * // 'callback' should only be second-last to the 'message' argument, otherwise always last.
   * this.demoTest = function (browser) {
   *   browser.waitForElementVisible('body', 1000);
   *   // continue if failed
   *   browser.waitForElementVisible('body', 1000, false);
   *   // with callback
   *   browser.waitForElementVisible('body', 1000, function() {
   *     // do something while we're here
   *   });
   *   // custom Spanish message
   *   browser.waitForElementVisible('body', 1000, 'elemento %s no era visible en %d ms');
   *   // many combinations possible - the message is always the last argument
   *   browser.waitForElementVisible('body', 1000, false, function() {}, 'elemento %s no era visible en %d ms');
   * };
   *
   * @see https://nightwatchjs.org/api/waitForElementVisible.html
   */
  waitForElementVisible(
    selector: Definition,
    timeoutOrCallbackOrMessage?: number | NightwatchGenericCallback<boolean> | string,
    pollIntervalOrAbortOnFailureOrCallbackOrMessage?: number | boolean | NightwatchGenericCallback<boolean> | string,
    abortOnFailureOrCallbackOrMessage?: boolean | NightwatchGenericCallback<boolean> | string,
    callbackOrMessage?: NightwatchGenericCallback<boolean> | string,
    message?: string
  ): Awaitable<this, true | Error>;

  waitForElementVisible(
    using: LocateStrategy,
    selector: Definition,
    timeoutOrCallbackOrMessage?: number | NightwatchGenericCallback<boolean> | string,
    pollIntervalOrAbortOnFailureOrCallbackOrMessage?: number | boolean | NightwatchGenericCallback<boolean> | string,
    abortOnFailureOrCallbackOrMessage?: boolean | NightwatchGenericCallback<boolean> | string,
    callbackOrMessage?: NightwatchGenericCallback<boolean> | string,
    message?: string
  ): Awaitable<this, true | Error>;

  /**
   * Returns the computed WAI-ARIA label of an element.
   *
   * @example
   * module.exports = {
   *   demoTest() {
   *     browser.getAccessibleName('*[name="search"]', function(result) {
   *       this.assert.equal(typeof result, 'object);
   *       this.assert.equal(result.value, 'search input');
   *     });
   *
   *     // with explicit locate strategy
   *     browser.getAccessibleName('css selector', '*[name="search"]', function(result) {
   *       console.log('getAccessibleName result', result.value);
   *     });
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.getAccessibleName({
   *       selector: '*[name="search"]',
   *       index: 1
   *     }, function(result) {
   *       console.log('getAccessibleName result', result.value);
   *     });
   *
   *     browser.getAccessibleName({
   *       selector: '*[name="search"]',
   *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
   *     }, function(result) {
   *       console.log('getAccessibleName result', result.value);
   *     });
   *   },
   *
   *   demoTestAsync: async function() {
   *     const result = await browser.getAccessibleName('*[name="search"]');
   *     console.log('getAccessibleName result', result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/getAccessibleName.html
   */
  getAccessibleName(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;
  getAccessibleName(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;

  /**
   * Returns the computed WAI-ARIA role of an element.
   *
   * @example
   * module.exports = {
   *   demoTest(browser) {
   *     browser.getAriaRole('*[name="search"]', function(result) {
   *       this.assert.equal(typeof result, 'object');
   *       this.assert.equal(result.value, 'combobox');
   *     });
   *
   *     // with explicit locate strategy
   *     browser.getAriaRole('css selector', '*[name="search"]', function(result) {
   *       console.log('getAriaRole result', result.value);
   *     });
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.getAriaRole({
   *       selector: '*[name="search"]',
   *       index: 1
   *     }, function(result) {
   *       console.log('getAriaRole result', result.value);
   *     });
   *
   *     browser.getAriaRole({
   *       selector: '*[name="search"]',
   *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
   *     }, function(result) {
   *       console.log('getAriaRole result', result.value);
   *     });
   *   },
   *
   *   demoTestAsync: async function(browser) {
   *     const result = await browser.getAriaRole('*[name="search"]');
   *     console.log('getAriaRole result', result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/getAriaRole.html
   */
  getAriaRole(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;
  getAriaRole(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;

  /**
   * Determine an element's size in pixels. For W3C Webdriver compatible clients (such as GeckoDriver), this command is equivalent to `getLocation` and both return
   * the dimensions and coordinates of the given element:
   * - x: X axis position of the top-left corner of the element, in CSS pixels
   * - y: Y axis position of the top-left corner of the element, in CSS pixels
   * - height: Height of the element’s bounding rectangle in CSS pixels;
   * - width: Width of the web element’s bounding rectangle in CSS pixels.
   *
   * @example
   * module.exports = {
   *   demoTest() {
   *     browser.getElementSize('#login', function(result) {
   *       console.log('result', result);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.getElementSize('css selector', '#login', function(result) {
   *       console.log('result', result);
   *     });
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.getElementSize({
   *       selector: '#login',
   *       index: 1,
   *       suppressNotFoundErrors: true
   *     }, function(result) {
   *       console.log('result', result);
   *     });
   *   },
   *
   *   demoTestAsync: async function() {
   *     const result = await browser.getElementSize('#login');
   *     console.log('classList', result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/getElementRect.html
   */
  getElementRect(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<NightwatchSizeAndPosition>
    ) => void
  ): Awaitable<this, NightwatchSizeAndPosition>;
  getElementRect(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<NightwatchSizeAndPosition>
    ) => void
  ): Awaitable<this, NightwatchSizeAndPosition>;

  /**
   *
   * Uploads file to an element using absolute file path.
   *
   *
   * @example
   * // send a file to for upload to a field.
   * this.demoTest = function (browser) {
   *   browser.uploadFile('#myFile', '/path/file.pdf');
   * };
   *
   *
   * @see https://nightwatchjs.org/api/uploadFile.html
   */
  uploadFile(
    selector: Definition,
    filePath: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  uploadFile(
    using: LocateStrategy,
    selector: Definition,
    filePath: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Sends some text to an element. Can be used to set the value of a form element or
   *  to send a sequence of key strokes to an element. Any UTF-8 character may be specified.
   *
   * <div class="alert alert-warning"><strong>updateValue</strong> is equivalent
   * with <strong>setValue</strong> and <strong>sendKeys</strong> with the exception
   * that it clears the value beforehand.</div>
   *
   * An object map with available keys and their respective UTF-8 characters,
   * as defined on [W3C WebDriver draft spec](https://www.w3.org/TR/webdriver/#character-types),
   * is loaded onto the main Nightwatch instance as `browser.Keys`.
   *
   * @example
   * // send some simple text to an input
   * this.demoTest = function (browser) {
   *   browser.updateValue('input[type=text]', 'nightwatch');
   * };
   *
   * // send some text to an input and hit enter.
   * this.demoTest = function (browser) {
   *   browser.updateValue('input[type=text]', ['nightwatch', browser.Keys.ENTER]);
   * };
   *
   * @see https://nightwatchjs.org/api/updateValue.html
   */
  updateValue(
    selector: Definition,
    inputValue: string | string[],
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  updateValue(
    using: LocateStrategy,
    selector: Definition,
    inputValue: string | string[],
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  /**
   * Drag an element to the given position or destination element.
   *
   * @example
   * module.exports = {
   *   demoTest(browser) {
   *     browser.dragAndDrop('#main', {x: 100, y:100}):
   *
   *
   *
   *  //using webElement as a destination
   *   demoTestAsync: async function(browser) {
   *     const destination = await browser.findElement('#upload');
   *     browser.dragAndDrop('#main', destination.getId());
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/dragAndDrop.html
   */
  dragAndDrop(
    selector: Definition,
    destination: NightwatchElement | NightwatchPosition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  dragAndDrop(
    using: LocateStrategy,
    selector: Definition,
    destination: NightwatchElement | NightwatchPosition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Returns an element's first child. The child element will be returned as web
   * element JSON object (with an added .getId() convenience method).
   *
   *
   * @example
   * module.exports = {
   *  'demo Test': function(browser) {
   *     const resultElement = await browser.getFirstElementChild('.features-container');
   *
   *     console.log('last child element Id:', resultElement.getId());
   *   },
   *
   * @see https://nightwatchjs.org/api/getFirstElementChild.html
   */
  getFirstElementChild(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<JSON_WEB_OBJECT>
    ) => void
  ): Awaitable<this, JSON_WEB_OBJECT>;
  getFirstElementChild(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<JSON_WEB_OBJECT>
    ) => void
  ): Awaitable<this, JSON_WEB_OBJECT>;

  /**
   * Returns an element's last child. The child element will be returned
   * as web element JSON object (with an added .getId() convenience method).
   *
   *
   * @example
   * module.exports = {
   *  'demo Test': function(browser) {
   *     const resultElement = await browser.getLastElementChild('.features-container');
   *
   *     console.log('last child element Id:', resultElement.getId());
   *   },
   *
   * @see https://nightwatchjs.org/api/getLastElementChild.html
   */
  getLastElementChild(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<JSON_WEB_OBJECT>
    ) => void
  ): Awaitable<this, JSON_WEB_OBJECT>;
  getLastElementChild(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<JSON_WEB_OBJECT>
    ) => void
  ): Awaitable<this, JSON_WEB_OBJECT>;

  /**
   * Returns the element immediately following the specified one in their parent's childNodes.
   * The element will be returned as web element JSON object (with an added .getId() convenience method).
   *
   *
   * @example
   * module.exports = {
   *  'demo Test': function(browser) {
   *     const resultElement = await browser.getNextSibling('.features-container li:first-child');
   *
   *     console.log('next sibling element Id:', resultElement.getId());
   *   },
   *
   * @see https://nightwatchjs.org/api/getNextSibling.html
   */
  getNextSibling(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<JSON_WEB_OBJECT>
    ) => void
  ): Awaitable<this, JSON_WEB_OBJECT>;
  getNextSibling(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<JSON_WEB_OBJECT>
    ) => void
  ): Awaitable<this, JSON_WEB_OBJECT>;

  /**
   *  Returns the element immediately preceding the specified one in its parent's child elements list.
   * The element will be returned as web element JSON object (with an added `.getId()` convenience method).
   *
   *
   * @example
   * module.exports = {
   *  'demo Test': function(browser) {
   *     const resultElement = await browser.getPreviousSibling('.features-container li:second-child');
   *
   *     console.log('previous sibling element Id:', resultElement.getId());
   *   },
   *
   * browser.getPreviousSibling('#web-button', function(result) {
   *
   *   console.log(result.value)
   * }})
   * await browser.getPreviousSibling('#web-button')
   * await browser.getPreviousSibling({selector: '#web-button', locateStrategy: 'css selector'})
   *
   * // with global element():
   * const formEl = element('form');
   * const result = await browser.getPreviousSibling(formEl)
   *
   * // with Selenium By() locators
   * // https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_By.html
   * const locator = by.tagName('form');
   * const result = await browser.getPreviousSibling(locator)
   *
   * // with browser.findElement()
   * const formEl = await browser.findElement('form');
   * const result = await browser.getPreviousSibling(formEl)
   *
   * @see https://nightwatchjs.org/api/getPreviousSibling.html
   */
  getPreviousSibling(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<JSON_WEB_OBJECT>
    ) => void
  ): Awaitable<this, JSON_WEB_OBJECT>;
  getPreviousSibling(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<JSON_WEB_OBJECT>
    ) => void
  ): Awaitable<this, JSON_WEB_OBJECT>;

  /**
   * Returns true or false based on whether the DOM has any child nodes
   *
   * @example
   * module.exports = {
   *  'demo Test': function(browser) {
   *     const result = await browser.hasDescendants('.features-container');
   *
   *     console.log('true or false:', result);
   *   },
   *
   * @see https://nightwatchjs.org/api/hasDescendants.html
   */
  hasDescendants(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<boolean>
    ) => void
  ): Awaitable<this, boolean>;
  hasDescendants(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<boolean>
    ) => void
  ): Awaitable<this, boolean>;

  /**
   * Returns the `shadowRoot` read-only property which represents the shadow root hosted by the element.
   *  This can further be used to retrieve elements part of the shadow root element.
   *
   * @example
   * describe('Shadow Root example test', function() {
   *   it('retrieve the shadowRoot', async function(browser) {
   *      await browser
   *        .navigateTo('https://mdn.github.io/web-components-examples/popup-info-box-web-component/')
   *        .waitForElementVisible('form');
   *
   *      const shadowRootEl = await browser.getShadowRoot('popup-info');
   *      const infoElement = await shadowRootEl.find('.info');
   *
   *      await expect(infoElement.property('innerHTML')).to.include('card validation code');
   *      const iconElement = await shadowRootEl.find('.icon');
   *      const firstElement = await browser.getFirstElementChild(iconElement);
   *
   *      await expect.element(firstElement).to.be.an('img');
   *    });
   * });
   *
   * @see https://nightwatchjs.org/api/getShadowRoot.html
   */
  getShadowRoot(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<ElementGlobal | null>
    ) => void
  ): Awaitable<this, ElementGlobal | null>;
  getShadowRoot(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<ElementGlobal | null>
    ) => void
  ): Awaitable<this, ElementGlobal | null>;

  /**
   * Search for an elements on the page, starting from the document root. The located element will be returned as web element JSON object (with an added .getId() convenience method).
   * First argument is the element selector, either specified as a string or as an object (with 'selector' and 'locateStrategy' properties).
   *
   * @example
   * module.exports = {
   *  'demo Test': function(browser) {
   *     const resultElement = await browser.findElement('.features-container li:first-child');
   *
   *     console.log('Element Id:', resultElement.getId());
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/findElement.html
   */
  findElement(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<JSON_WEB_OBJECT>
    ) => void
  ): Awaitable<this, JSON_WEB_OBJECT>;
  findElement(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<JSON_WEB_OBJECT>
    ) => void
  ): Awaitable<this, JSON_WEB_OBJECT>;

  /**
   * Search for multiple elements on the page, starting from the document root. The located elements will be returned as web element JSON objects (with an added .getId() convenience method).
   * First argument is the element selector, either specified as a string or as an object (with 'selector' and 'locateStrategy' properties).
   *
   *
   * @example
   * module.exports = {
   *  'demo Test': function(browser) {
   *     const resultElements = await browser.findElements('.features-container li');
   *
   *     resultElements.forEach(item => console.log('Element Id:', item.getId()));
   *   },
   *
   * @see https://nightwatchjs.org/api/findElements.html
   */
  findElements(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<JSON_WEB_OBJECT[]>
    ) => void
  ): Awaitable<this, JSON_WEB_OBJECT[]>;
  findElements(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<JSON_WEB_OBJECT[]>
    ) => void
  ): Awaitable<this, JSON_WEB_OBJECT[]>;

  /**
   * Retrieve the value of a specified DOM property for the given element.
   * For all the available DOM element properties, consult the [Element doc at MDN](https://developer.mozilla.org/en-US/docs/Web/API/element).
   *
   * @example
   * module.exports = {
   *   demoTest(browser) {
   *     browser.getElementProperty('#login input[type=text]', 'classList', function(result) {
   *       console.log('result', result);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.getElementProperty('css selector', '#login input[type=text]', 'classList', function(result) {
   *       console.log('result', result);
   *     });
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.getElementProperty({
   *       selector: '#login input[type=text]',
   *       index: 1,
   *       suppressNotFoundErrors: true
   *     }, 'classList', function(result) {
   *       console.log('result', result);
   *     });
   *   },
   *
   *   demoTestAsync: async function(browser) {
   *     const result = await browser.getElementProperty('#login input[type=text]', 'classList');
   *     console.log('classList', result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/getElementProperty.html
   */
  getElementProperty(
    selector: Definition,
    property: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<any>
    ) => void
  ): Awaitable<this, any>;
  getElementProperty(
    using: LocateStrategy,
    selector: Definition,
    property: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<any>
    ) => void
  ): Awaitable<this, any>;

  /**
   *
   * Determines if an element is enabled, as indicated by the 'disabled' attribute.
   *
   * @example
   * module.exports = {
   *   demoTest(browser) {
   *     browser.isEnabled('#main select option.first', function(result) {
   *       this.assert.equal(typeof result, "object");
   *       this.assert.equal(result.status, 0);
   *       this.assert.equal(result.value, true);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.isEnabled('css selector', '#main select option.first');
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.isEnabled({
   *       selector: '#main ul li a',
   *       index: 1,
   *       suppressNotFoundErrors: true
   *     });
   *
   *     browser.isEnabled({
   *       selector: '#main select option.first',
   *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
   *     });
   *   },
   *
   *   demoTestAsync: async function(browser) {
   *     const result = await browser.isEnabled('#main select option.first');
   *     console.log('isVisible result', result);
   *   }
   * }
   * @see https://nightwatchjs.org/api/isEnabled.html
   */
  isEnabled(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<boolean>
    ) => void
  ): Awaitable<this, boolean>;
  isEnabled(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<boolean>
    ) => void
  ): Awaitable<this, boolean>;

  /**
   *
   * Determines if an element is selected.
   *
   * @example
   * module.exports = {
   *   demoTest(browser) {
   *     browser.isSelected('#main select option.first', function(result) {
   *       this.assert.equal(typeof result, "object");
   *       this.assert.equal(result.status, 0);
   *       this.assert.equal(result.value, true);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.isSelected('css selector', '#main select option.first');
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.isSelected({
   *       selector: '#main ul li a',
   *       index: 1,
   *       suppressNotFoundErrors: true
   *     });
   *
   *     browser.isSelected({
   *       selector: '#main select option.first',
   *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
   *     });
   *   },
   *
   *   demoTestAsync: async function(browser) {
   *     const result = await browser.isSelected('#main select option.first');
   *     console.log('isVisible result', result);
   *   }
   * }
   * @see https://nightwatchjs.org/api/isSelected.html
   */
  isSelected(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<boolean>
    ) => void
  ): Awaitable<this, boolean>;
  isSelected(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<boolean>
    ) => void
  ): Awaitable<this, boolean>;

  /**
   *
   * Set the value of a specified DOM attribute for the given element.
   * For all the available DOM attributes, consult the [Element doc at MDN](https://developer.mozilla.org/en-US/docs/Web/API/element).
   *
   * @example
   * module.exports = {
   *   demoTest(browser) {
   *     browser.setAttribute('#login input[type=text]', 'disabled', 'true', function(result) {
   *       console.log('result', result);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.setAttribute('css selector', '#login input[type=text]', 'disabled', 'true', function(result) {
   *       console.log('result', result);
   *     });
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.setAttribute({
   *       selector: '#login input[type=text]',
   *       index: 1,
   *       suppressNotFoundErrors: true
   *     }, 'disabled', 'true', function(result) {
   *       console.log('result', result);
   *     });
   *   },
   *
   *   demoTestAsync: async function(browser) {
   *     await browser.setAttribute('#login input[type=text]', 'disabled', 'true');
   *   }
   * }
   * @see https://nightwatchjs.org/api/setAttribute.html
   */
  setAttribute(
    selector: Definition,
    attribute: string,
    value: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<boolean>
    ) => void
  ): Awaitable<this, boolean>;
  setAttribute(
    using: LocateStrategy,
    selector: Definition,
    attribute: string,
    value: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<boolean>
    ) => void
  ): Awaitable<this, boolean>;

  /**
   *
   * An alias of "setValue" command, but hides the content from the nightwatch logs.
   *
   * <div class="alert alert-warning"><strong>setValue/setPassword</strong> do not clear
   * the existing value of the element. To do so, use the <strong>clearValue()</strong> command.</div>
   *
   * An object map with available keys and their respective UTF-8 characters,
   *  as defined on [W3C WebDriver draft spec](https://www.w3.org/TR/webdriver/#character-types), is loaded onto the main Nightwatch instance as `browser.Keys`.
   *
   * @example
   * // send some simple text to an input
   * this.demoTest = function (browser) {
   *   browser.setPassword('input[type=text]', 'nightwatch');
   * };
   * //
   * // send some text to an input and hit enter.
   * this.demoTest = function (browser) {
   *   browser.setPassword('input[type=text]', ['nightwatch', browser.Keys.ENTER]);
   * };
   *
   */
  setPassword(
    selector: Definition,
    inputValue: string | string[],
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  setPassword(
    using: LocateStrategy,
    selector: Definition,
    inputValue: string | string[],
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   *
   * Take a screenshot of the visible region encompassed by this element's bounding rectangle.
   *
   * @example
   * module.exports = {
   *   demoTest(browser) {
   *     browser.takeElementScreenshot('#main', function (imageData, err) {
   *       require('fs').writeFile('out.png', imageData.value, 'base64', function (err) {
   *         console.log(err);
   *       });
   *     });
   *
   *     // with explicit locate strategy
   *     browser.takeElementScreenshot('css selector', '#main', function(imageData, err) {
   *       require('fs').writeFile('out.png', imageData.value, 'base64', function (err) {
   *         console.log(err);
   *       });
   *     });
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.takeElementScreenshot({
   *       selector: '#main ul li a',
   *       index: 1
   *     }, function(imageData, err) {
   *       require('fs').writeFile('out.png', imageData.value, 'base64', function (err) {
   *         console.log(err);
   *       });
   *     });
   *   },
   *
   *   demoTestAsync: async function(browser) {
   *     const data = await browser.takeElementScreenshot('#main');
   *     require('fs').writeFile('out.png', data, 'base64');
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/takeElementScreenshot.html
   */
  takeElementScreenshot(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;
  takeElementScreenshot(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;

  /**
   * Will uncheck, click, on a checked checkbox or radio input if not already unchecked.
   *
   * @example
   * module.exports = {
   *   demoTest(browser) {
   *     browser.uncheck('input[type=checkbox]:checked)');
   *
   *     browser.uncheck('input[type=checkbox]:checked)', function(result) {
   *       console.log('Check result', result);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.uncheck('css selector', 'input[type=checkbox]:checked)');
   *
   *     // with selector object - see https://nightwatchjs.org/guide#element-properties
   *     browser.uncheck({
   *       selector: 'input[type=checkbox]:checked)',
   *       index: 1,
   *       suppressNotFoundErrors: true
   *     });
   *
   *     browser.uncheck({
   *       selector: 'input[type=checkbox]:checked)',
   *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
   *     });
   *   },
   *
   *   demoTestAsync: async function(browser) {
   *     const result = await browser.uncheck('input[type=checkbox]:checked)');
   *     console.log('Check result', result);
   *   }
   * }
   * 
   * Will uncheck, click, on a checked checkbox or radio input if not already unchecked.
   *
   * @see https://nightwatchjs.org/api/uncheck.html
   */
  uncheck(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  uncheck(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
}

export interface AppiumCommands<ReturnType = unknown> {
  /**
   * Get the current device orientation.
   *
   * @example
   * module.exports = {
   *   'get current device orientation': function (app) {
   *     app
   *       .appium.getOrientation(function (result) {
   *         console.log('current device orientation is:', result.value);
   *       });
   *   },
   *
   *   'get current device orientation with ES6 async/await': async function (app) {
   *     const orientation = await app.appium.getOrientation();
   *     console.log('current device orientation is:', orientation);
   *   }
   * };
   */
  getOrientation(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<'LANDSCAPE' | 'PORTRAIT'>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, 'LANDSCAPE' | 'PORTRAIT'>;

  /**
   * Set the current device orientation.
   *
   * @example
   * module.exports = {
   *   'set orientation to LANDSCAPE': function (app) {
   *     app
   *       .appium.setOrientation('LANDSCAPE');
   *   }
   * };
   */
  setOrientation(
    orientation: 'LANDSCAPE' | 'PORTRAIT',
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<'LANDSCAPE' | 'PORTRAIT'>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, 'LANDSCAPE' | 'PORTRAIT'>;

  /**
   * Get a list of the available contexts. Used when testing hybrid mobile apps using Appium.
   *
   * More info here: https://appium.io/docs/en/commands/context/get-contexts/
   *
   * @example
   * module.exports = {
   *   'get available contexts': function (app) {
   *     app
   *       .appium.getContexts(function (result) {
   *         console.log('the available contexts are:', result.value);
   *       });
   *   },
   *
   *   'get available contexts with ES6 async/await': async function (app) {
   *     const contexts = await app.appium.getContexts();
   *     console.log('the available contexts are:', contexts);
   *   }
   * };
   */
  getContexts(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string[]>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, string[]>;

  /**
   * Get the current context in which Appium is running. Used when testing hybrid mobile apps using Appium.
   *
   * More info here: https://appium.io/docs/en/commands/context/get-context/
   *
   * @example
   * module.exports = {
   *   'get current context': function (app) {
   *     app
   *       .appium.getContext(function (result) {
   *         console.log('the current context is:', result.value);
   *       });
   *   },
   *
   *   'get current context with ES6 async/await': async function (app) {
   *     const context = await app.appium.getContext();
   *     console.log('the current context is:', context);
   *   }
   * };
   */
  getContext(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string | null>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, string | null>;

  /**
   * Set the context to be automated. Used when testing hybrid mobile apps using Appium.
   *
   * More info here: https://appium.io/docs/en/commands/context/set-context/
   *
   * @example
   * module.exports = {
   *   'switch to webview context': async function (app) {
   *     app
   *       .waitUntil(async function() {
   *         // wait for webview context to be available
   *         // initially, this.getContexts() only returns ['NATIVE_APP']
   *         const contexts = await this.appium.getContexts();
   *
   *         return contexts.length > 1;
   *       })
   *       .perform(async function() {
   *         // switch to webview context
   *         const contexts = await this.appium.getContexts();  // contexts: ['NATIVE_APP', 'WEBVIEW_<id>']
   *         await this.appium.setContext(contexts[1]);
   *       });
   *   },
   *
   *   'switch to native context': function (app) {
   *     app.appium.setContext('NATIVE_APP');
   *   }
   * };
   */
  setContext(
    context: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Reset the current session (run delete and create session).
   *
   * More info here: https://appium.io/docs/en/2.3/commands/base-driver/#reset
   *
   * @example
   * module.exports = {
   *   'start an android activity': function (app) {
   *     app
   *       .appium.resetApp();
   *   },
   *
   *   'reset the app activity and wait for onboarding activity to start': function (app) {
   *     app
   *       .appium.resetApp();
   *   }
   * };
   */
  resetApp(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, null>;
  /**
   * Start an Android activity by providing package name, activity name and other optional parameters.
   *
   * More info here: https://appium.io/docs/en/commands/device/activity/start-activity/
   *
   * @example
   * module.exports = {
   *   'start an android activity': function (app) {
   *     app
   *       .appium.startActivity({
   *         appPackage: 'com.android.chrome',
   *         appActivity: 'com.google.android.apps.chrome.Main'
   *       });
   *   },
   *
   *   'start the main Android activity and wait for onboarding activity to start': function (app) {
   *     app
   *       .appium.startActivity({
   *         appPackage: 'org.wikipedia',
   *         appActivity: 'org.wikipedia.main.MainActivity',
   *         appWaitActivity: 'org.wikipedia.onboarding.InitialOnboardingActivity'
   *       });
   *   }
   * };
   */
  startActivity(
    opts: {
      appPackage: string;
      appActivity: string;
      appWaitPackage?: string;
      appWaitActivity?: string;
      intentAction?: string;
      intentCategory?: string;
      intentFlags?: string;
      optionalIntentArguments?: string;
      dontStopAppOnReset?: boolean;
    },
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Get the name of the current Android activity.
   *
   * @example
   * module.exports = {
   *   'get current activity name': function (app) {
   *     app
   *       .appium.getCurrentActivity(function (result) {
   *         console.log('current android activity is:', result.value);
   *       });
   *   },
   *
   *   'get current activity name with ES6 async/await': async function (app) {
   *     const activity = await app.appium.getCurrentActivity();
   *     console.log('current android activity is:', activity);
   *   }
   * };
   */
  getCurrentActivity(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, string>;

  /**
   * Get the name of the current Android package.
   *
   * @example
   * module.exports = {
   *   'get current package name': function (app) {
   *     app
   *       .appium.getCurrentPackage(function (result) {
   *         console.log('current android package is:', result.value);
   *       });
   *   },
   *
   *   'get current package name with ES6 async/await': async function (app) {
   *     const packageName = await app.appium.getCurrentPackage();
   *     console.log('current android package is:', packageName);
   *   }
   * };
   */
  getCurrentPackage(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, string>;

  /**
   * Get the current geolocation of the mobile device.
   *
   * @example
   * module.exports = {
   *   'get device geolocation': function (app) {
   *     app
   *       .appium.getGeolocation(function (result) {
   *         console.log('current device geolocation is:', result.value);
   *       });
   *   },
   *
   *   'get device geolocation with ES6 async/await': async function (app) {
   *     const location = await app.appium.getGeolocation();
   *     console.log('current device geolocation is:', location);
   *   }
   * };
   */
  getGeolocation(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<AppiumGeolocation>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, AppiumGeolocation>;

  /**
   * Set the current geolocation of the mobile device.
   *
   * @example
   * module.exports = {
   *   'set geolocation to Tokyo, Japan': function (app) {
   *     app
   *       .appium.setGeolocation({latitude: 35.689487, longitude: 139.691706, altitude: 5});
   *   },
   *
   *   'set geolocation to Tokyo, Japan with ES6 async/await': async function (app) {
   *     await app.appium.setGeolocation({latitude: 35.689487, longitude: 139.691706});
   *   }
   * };
   */
  setGeolocation(
    coordinates: AppiumGeolocation,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<AppiumGeolocation>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, AppiumGeolocation>;

  /**
   * Press a particular key on an Android Device.
   *
   * See [official Android Developers docs](https://developer.android.com/reference/android/view/KeyEvent.html) for reference of available Android key code values.
   *
   * @example
   * module.exports = {
   *   'press e with caps lock on (keycode 33 and metastate 1048576)': function (app) {
   *     app
   *       .appium.pressKeyCode(33, 1048576);
   *   },
   *
   *   'press g (keycode 35) with ES6 async/await': async function (app) {
   *     await app.appium.pressKeyCode(35);
   *   }
   * };
   */
  pressKeyCode(
    keycode: number,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, null>;
  pressKeyCode(
    keycode: number,
    metastate?: number,
    flags?: number,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Press and hold a particular key on an Android Device.
   *
   * See [official Android Developers docs](https://developer.android.com/reference/android/view/KeyEvent.html) for reference of available Android key code values.
   *
   * @example
   * module.exports = {
   *   'long press e with caps lock on (keycode 33 and metastate 1048576)': function (app) {
   *     app
   *       .appium.longPressKeyCode(33, 1048576);
   *   },
   *
   *   'long press g (keycode 35) with ES6 async/await': async function (app) {
   *     await app.appium.longPressKeyCode(35);
   *   }
   * };
   */
  longPressKeyCode(
    keycode: number,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, null>;
  longPressKeyCode(
    keycode: number,
    metastate?: number,
    flags?: number,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Hide soft keyboard.
   *
   * @example
   * module.exports = {
   *   'hide device soft keyboard': function (app) {
   *     app
   *       .appium.hideKeyboard();
   *   },
   *
   *   'hide device soft keyboard with ES6 async/await': async function (app) {
   *     await app.appium.hideKeyboard();
   *   }
   * };
   */
  hideKeyboard(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<boolean>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, boolean>;

  /**
   * Whether or not the soft keyboard is shown.
   *
   * @example
   * module.exports = {
   *   'whether keyboard is shown': function (app) {
   *     app
   *       .appium.isKeyboardShown(function (result) {
   *         console.log('result value of whether keyboard is shown:', result.value);
   *       });
   *   },
   *
   *   'whether keyboard is shown with ES6 async/await': async function (app) {
   *     const result = await app.appium.isKeyboardShown();
   *     console.log('result value of whether keyboard is shown:', result);
   *   }
   * };
   */
  isKeyboardShown(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<boolean>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, boolean>;
}

export interface Cookie {
  name: string;
  value: string;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  expiry?: number;
  sameSite?: 'Lax' | 'Strict' | 'None';
}

export interface CookiesNsCommands<ReturnType = unknown> {
  /**
   * Retrieve a single cookie visible to the current page.
   *
   * The cookie is returned as a cookie JSON object, with properties as defined [here](https://www.w3.org/TR/webdriver/#dfn-table-for-cookie-conversion).
   *
   * @example
   * module.exports = {
   *   'get a cookie': function (browser) {
   *     browser
   *       .cookies.get('test_cookie', function (result) {
   *         const cookie = result.value;
   *         this.assert.equal(cookie.name, 'test_cookie');
   *         this.assert.equal(cookie.value, '123456');
   *       });
   *   },
   *
   *   'get a cookie with ES6 async/await': async function (browser) {
   *     const cookie = await browser.cookies.get('test_cookie');
   *     browser.assert.equal(cookie.name, 'test_cookie');
   *     browser.assert.equal(cookie.value, '123456');
   *   }
   * };
   */
  get(
    name: string,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<Cookie | null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, Cookie | null>;

  /**
   * Retrieve all cookies visible to the current page.
   *
   * The cookies are returned as an array of cookie JSON object, with properties as defined [here](https://www.w3.org/TR/webdriver/#dfn-table-for-cookie-conversion).
   *
   * @example
   * module.exports = {
   *   'get all cookies': function (browser) {
   *     browser
   *       .cookies.getAll(function (result) {
   *         this.assert.equal(result.value.length, 1);
   *         this.assert.equal(result.value[0].name, 'test_cookie');
   *       });
   *   },
   *
   *   'get all cookies with ES6 async/await': async function (browser) {
   *     const cookies = await browser.cookies.getAll();
   *     browser.assert.equal(cookies.length, 1);
   *     browser.assert.equal(cookies[0].name, 'test_cookie');
   *   }
   * };
   */
  getAll(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<Cookie[]>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, Cookie[]>;

  /**
   * Set a cookie, specified as a cookie JSON object, with properties as defined [here](https://www.w3.org/TR/webdriver/#dfn-table-for-cookie-conversion).
   *
   * @example
   * module.exports = {
   *   'set a cookie': function (browser) {
   *     browser
   *       .cookies.set({
   *         name: "test_cookie",
   *         value: "test_value",
   *         path: "/", // (Optional)
   *         domain: "example.org", // (Optional)
   *         secure: false, // (Optional)
   *         httpOnly: false, // (Optional)
   *         expiry: 1395002765 // (Optional) time in seconds since midnight, January 1, 1970 UTC
   *       });
   *   },
   *
   *   'set a cookie with ES6 async/await': async function (browser) {
   *     await browser.cookies.set({
   *       name: 'test_cookie',
   *       value: 'test_value',
   *       domain: 'example.org', // (Optional)
   *       sameSite: 'Lax' // (Optional)
   *     });
   *   }
   * };
   */
  set(
    cookie: Cookie,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Delete the cookie with the given name. This command is a no-op if there is no such cookie visible to the current page.
   *
   * @example
   * module.exports = {
   *   'delete a cookie': function (browser) {
   *     browser
   *       .cookies.delete('test_cookie', function () {
   *         console.log('cookie deleted successfully');
   *       });
   *   },
   *
   *   'delete a cookie with ES6 async/await': async function (browser) {
   *     await browser.cookies.delete('test_cookie');
   *   }
   * };
   */
  delete(
    cookieName: string,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Delete all cookies visible to the current page.
   *
   * @example
   * module.exports = {
   *   'delete all cookies': function (browser) {
   *     browser
   *       .cookies.deleteAll(function() {
   *         console.log('all cookies deleted successfully');
   *       });
   *   },
   *
   *   'delete all cookies with ES6 async/await': async function (browser) {
   *     await browser.cookies.deleteAll();
   *   }
   * };
   */
  deleteAll(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;
}

type FirefoxContext = 'content' | 'chrome';
export interface FirefoxNsCommands<ReturnType = unknown> {
  getContext(): Awaitable<IfUnknown<ReturnType, this>, FirefoxContext>;
  setContext(ctx: FirefoxContext | PromiseLike<FirefoxContext>): Awaitable<IfUnknown<ReturnType, this>, null>;
  installAddon(path: string, temporary?: boolean): Awaitable<IfUnknown<ReturnType, this>, string>;
  uninstallAddon(addonId: string | PromiseLike<string>): Awaitable<IfUnknown<ReturnType, this>, null>;
}

type NetworkConditionsSpec = {
  offline: boolean,
  latency: number,
  download_throughput: number,
  upload_throughput: number
};

export interface ChromeNsCommands<ReturnType = unknown> {
  /**
   * Launch Chrome App with given ID.
   * @param id ID of the App to launch.
   */
  launchApp(
    id: string
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Get Chromium network emulation settings.
   *
   * Network conditions must be set before it can be retrieved.
   */
  getNetworkConditions(): Awaitable<IfUnknown<ReturnType, this>, NetworkConditionsSpec>;

  /**
   * Set Chromium network emulation settings.
   *
   * @example
   * describe('set network conditions', function() {
   *  it('sets the network conditions', function() {
   *    browser
   *     .chrome.setNetworkConditions({
   *       offline: false,
   *       latency: 5, // Additional latency (ms).
   *       download_throughput: 500 * 1024, // Maximal aggregated download throughput.
   *       upload_throughput: 500 * 1024 // Maximal aggregated upload throughput.
   *    });
   *  });
   * });
   *
   * @param spec Defines the network conditions to set
   */
  setNetworkConditions(
    spec: NetworkConditionsSpec
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Delete Chromium network emulation settings.
   */
  deleteNetworkConditions(): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Sends an arbitrary devtools command to the browser.
   *
   * @param cmd The name of the command to send.
   * @param params The command parameters.
   * @see <https://chromedevtools.github.io/devtools-protocol/>
   */
  sendDevToolsCommand(
    cmd: string,
    params?: { [key: string]: any }
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Sends an arbitrary devtools command to the browser and get the result.
   *
   * @param cmd The name of the command to send.
   * @param params The command parameters.
   * @see <https://chromedevtools.github.io/devtools-protocol/>
   */
  sendAndGetDevToolsCommand(
    cmd: string,
    params?: { [key: string]: any }
  ): Awaitable<IfUnknown<ReturnType, this>, unknown>;

  /**
   * Set a permission state to the given value.
   *
   * @param name A name of the permission to update.
   * @param state State to set permission to.
   * @see <https://w3c.github.io/permissions/#permission-registry> for valid names
   */
  setPermission(
    name: string,
    state: 'granted' | 'denied' | 'prompt'
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Sends a DevTools command to change the browser's download directory.
   *
   * @param path The desired download directory.
   * @see chrome.sendDevToolsCommand
   */
  setDownloadPath(
    path: string
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Returns the list of cast sinks (Cast devices) available to the Chrome media router.
   *
   * @return An array of Strings containing the friendly device names of available cast sink targets.
   */
  getCastSinks(): Awaitable<IfUnknown<ReturnType, this>, string[]>;

  /**
   * Selects a cast sink (Cast device) as the recipient of media router intents (connect or play).
   *
   * @param deviceName name of the target device.
   */
  setCastSinkToUse(
    deviceName: string
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Initiates tab mirroring for the current browser tab on the specified device.
   *
   * @param deviceName name of the target device.
   */
  startCastTabMirroring(
    deviceName: string
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Returns an error message when there is any issue in a Cast session.
   */
  getCastIssueMessage(): Awaitable<IfUnknown<ReturnType, this>, string>;

  /**
   * Stops casting from media router to the specified device, if connected.
   *
   * @param deviceName name of the target device.
   */
  stopCasting(
    deviceName: string
  ): Awaitable<IfUnknown<ReturnType, this>, null>;
}

export interface NetworkNsCommands<ReturnType = unknown> {
  /**
   * Capture outgoing network calls from the browser.
   *
   * @example
   *  describe('capture network requests', function() {
   *    it('captures and logs network requests as they occur', function(this: ExtendDescribeThis<{requestCount: number}>) {
   *      this.requestCount = 1;
   *      browser
   *        .network.captureRequests((requestParams) => {
   *          console.log('Request Number:', this.requestCount!++);
   *          console.log('Request URL:', requestParams.request.url);
   *          console.log('Request method:', requestParams.request.method);
   *          console.log('Request headers:', requestParams.request.headers);
   *        })
   *        .navigateTo('https://www.google.com');
   *    });
   *  });
   *
   * @see https://nightwatchjs.org/guide/network-requests/capture-network-calls.html
   */
  captureRequests(
    onRequestCallback: (
      requestParams: Protocol.Network.RequestWillBeSentEvent
    ) => void,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Intercept the request made on a particular URL and mock the response.
   *
   * @example
   *  describe('mock network response', function() {
   *    it('intercepts the request made to Google search and mocks its response', function() {
   *      browser
   *        .network.mockResponse('https://www.google.com/', {
   *          status: 200,
   *          headers: {
   *            'Content-Type': 'UTF-8'
   *          },
   *          body: 'Hello there!'
   *        })
   *        .navigateTo('https://www.google.com/')
   *        .pause(2000);
   *    });
   *  });
   *
   * @see https://nightwatchjs.org/guide/network-requests/mock-network-response.html
   */
  mockResponse(
    urlToIntercept: string,
    response?: {
      status?: Protocol.Fetch.FulfillRequestRequest['responseCode'];
      headers?: { [name: string]: string };
      body?: Protocol.Fetch.FulfillRequestRequest['body'];
    },
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Command to set Chrome network emulation settings.
   *
   * @example
   * describe('set network conditions', function() {
   *  it('sets the network conditions',function() {
   *    browser
   *     .network.setConditions({
   *      offline: false,
   *      latency: 3000,
   *      download_throughput: 500 * 1024,
   *      upload_throughput: 500 * 1024
   *    });
   *  });
   * });
   *
   * @see https://nightwatchjs.org/api/setNetworkConditions.html
   */
  setConditions(
    spec: NetworkConditionsSpec,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, null>;
}

export interface AlertsNsCommands<ReturnType = unknown> {
  /**
   * Accepts the currently displayed alert dialog. Usually, this is equivalent to clicking on the 'OK' button in the dialog.
   *
   * @example
   * module.exports = {
   *   'accept open alert': function (browser) {
   *     browser
   *       .alerts.accept(function () {
   *         console.log('alert accepted successfully');
   *       });
   *   },
   *
   *   'accept open alert with ES6 async/await': async function (browser) {
   *     await browser.alerts.accept();
   *   }
   * };
   */
  accept(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Dismisses the currently displayed alert dialog.
   *
   * For confirm() and prompt() dialogs, this is equivalent to clicking the 'Cancel' button.
   * For alert() dialogs, this is equivalent to clicking the 'OK' button.
   *
   * @example
   * module.exports = {
   *   'dismiss open alert': function (browser) {
   *     browser
   *       .alerts.dismiss(function () {
   *         console.log('alert dismissed successfully');
   *       });
   *   },
   *
   *   'dismiss open alert with ES6 async/await': async function (browser) {
   *     await browser.alerts.dismiss();
   *   }
   * };
   */
  dismiss(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Get the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog.
   *
   * @example
   * module.exports = {
   *   'get open alert text': function (browser) {
   *     browser
   *       .alerts.getText(function (result) {
   *         console.log('text on open alert:', result.value);
   *       });
   *   },
   *
   *   'get open alert text with ES6 async/await': async function (browser) {
   *     const alertText = await browser.alerts.getText();
   *     console.log('text on open alert:', alertText);
   *   }
   * };
   */
  getText(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<string>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, string>;

  /**
   * Send keystrokes to a JavaScript prompt() dialog.
   *
   * @example
   * module.exports = {
   *   'set text on JS prompt': function (browser) {
   *     browser
   *       .alerts.setText('some text', function () {
   *         console.log('text sent to JS prompt successfully');
   *       });
   *   },
   *
   *   'set text on JS prompt with ES6 async/await': async function (browser) {
   *     await browser.alerts.setText('some text');
   *   }
   * };
   */
  setText(
    value: string,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;
}

export interface DocumentNsCommands<ReturnType = unknown> {
  /**
   * Utility command to load an external script into the page specified by url.
   *
   * @example
   * module.exports = {
   *   'inject external script': function (browser) {
   *      browser.document.injectScript('<script-url>', function () {
   *        console.log('script injected successfully');
   *      });
   *   },
   *
   *   'inject external script using ES6 async/await': async function (browser) {
   *      await browser.document.injectScript('<script-url>', 'injected-script');
   *   }
   * };
   */
  injectScript(
    scriptUrl: string,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<WebElement>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, WebElement>;
  injectScript(
    scriptUrl: string,
    id: string,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<WebElement>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, WebElement>;

  /**
   * Get the string serialized source of the current page.
   *
   * @example
   * module.exports = {
   *   'get page source': function (browser) {
   *      browser.document.source(function (result) {
   *        console.log('current page source:', result.value);
   *      });
   *   },
   *
   *   'get page source using ES6 async/await': async function (browser) {
   *      const pageSource = await browser.document.source();
   *      console.log('current page source:', pageSource);
   *   }
   * };
   *
   * @alias document.pageSource
   */
  source(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<string>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, string>;

  /**
   * Get the string serialized source of the current page.
   *
   * @example
   * module.exports = {
   *   'get page source': function (browser) {
   *      browser.document.pageSource(function (result) {
   *        console.log('current page source:', result.value);
   *      });
   *   },
   *
   *   'get page source using ES6 async/await': async function (browser) {
   *      const pageSource = await browser.document.pageSource();
   *      console.log('current page source:', pageSource);
   *   }
   * };
   *
   * @alias document.source
   */
  pageSource(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<string>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, string>;
}

export interface LogsNsCommands<ReturnType = unknown> {
  /**
   * Gets a log from Selenium.
   *
   * @example
   * describe('get log from Selenium', function() {
   *   it('get browser log (default)', function(browser) {
   *     browser.logs.getSessionLog(function(result) {
   *       if (result.status === 0) {
   *         const logEntriesArray = result.value;
   *         console.log('Log length: ' + logEntriesArray.length);
   *         logEntriesArray.forEach(function(log) {
   *           console.log('[' + log.level + '] ' + log.timestamp + ' : ' + log.message);
   *         });
   *       }
   *     });
   *   });
   *
   *   it('get driver log with ES6 async/await', async function(browser) {
   *     const driverLogAvailable = await browser.logs.isAvailable('driver');
   *     if (driverLogAvailable) {
   *       const logEntriesArray = await browser.logs.getSessionLog('driver');
   *       logEntriesArray.forEach(function(log) {
   *         console.log('[' + log.level + '] ' + log.timestamp + ' : ' + log.message);
   *       });
   *     }
   *   });
   * });
   *
   * @see https://nightwatchjs.org/api/logs/getSessionLog.html
   */
  getSessionLog(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<NightwatchLogEntry[]>) => void
  ): Awaitable<IfUnknown<ReturnType, this>, NightwatchLogEntry[]>;
  getSessionLog(
    typeString: NightwatchLogTypes,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<NightwatchLogEntry[]>) => void
  ): Awaitable<IfUnknown<ReturnType, this>, NightwatchLogEntry[]>;

  /**
   * Gets the available log types. More info about log types in WebDriver can be found here: https://github.com/SeleniumHQ/selenium/wiki/Logging
   *
   * @example
   * describe('get available log types', function() {
   *   it('get log types', function(browser) {
   *     browser.logs.getSessionLogTypes(function(result) {
   *       if (result.status === 0) {
   *         const logTypes = result.value;
   *         console.log('Log types available:', logTypes);
   *       }
   *     });
   *   });
   *
   *   it('get log types with ES6 async/await', async function(browser) {
   *     const logTypes = await browser.logs.getSessionLogTypes();
   *     console.log('Log types available:', logTypes);
   *   });
   * });
   *
   * @see https://nightwatchjs.org/api/logs/getSessionLogTypes.html
   */
  getSessionLogTypes(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<NightwatchLogTypes[]>
    ) => void
  ): Awaitable<
    IfUnknown<ReturnType, this>,
    NightwatchLogTypes[]
  >;

  /**
   * Utility command to test if the log type is available.
   *
   * @example
   * describe('test if the log type is available', function() {
   *   it('test browser log type', function(browser) {
   *     browser.logs.isSessionLogAvailable('browser', function(result) {
   *       if (result.status === 0) {
   *         const isAvailable = result.value;
   *         if (isAvailable) {
   *           // do something more in here
   *         }
   *       }
   *     });
   *   });
   *
   *   it('test driver log type with ES6 async/await', async function(browser) {
   *     const isAvailable = await browser.logs.isSessionLogAvailable('driver');
   *     if (isAvailable) {
   *       // do something more in here
   *     }
   *   });
   * });
   *
   * @see https://nightwatchjs.org/api/logs/isSessionLogAvailable.html
   */
  isSessionLogAvailable(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<boolean>) => void
  ): Awaitable<IfUnknown<ReturnType, this>, boolean>;
  isSessionLogAvailable(
    typeString: NightwatchLogTypes,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<boolean>) => void
  ): Awaitable<IfUnknown<ReturnType, this>, boolean>;

  /**
   * Listen to the `console` events (ex. `console.log` event) and
   * register callback to process the same.
   *
   * @example
   *  describe('capture console events', function() {
   *    it('captures and logs console.log event', function() {
   *      browser
   *        .captureBrowserConsoleLogs((event) => {
   *          console.log(event.type, event.timestamp, event.args[0].value);
   *        })
   *        .navigateTo('https://www.google.com')
   *        .executeScript(function() {
   *          console.log('here');
   *        }, []);
   *    });
   *  });
   *
   * @see https://nightwatchjs.org/guide/running-tests/capture-console-messages.html
   */
  captureBrowserConsoleLogs(
    onEventCallback: (
      event: Pick<
        Protocol.Runtime.ConsoleAPICalledEvent,
        'type' | 'timestamp' | 'args'
      >
    ) => void,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Catch the JavaScript exceptions thrown in the browser.
   *
   * @example
   *  describe('catch browser exceptions', function() {
   *    it('captures the js exceptions thrown in the browser', async function() {
   *      await browser.captureBrowserExceptions((event) => {
   *        console.log('>>> Exception:', event);
   *      });
   *
   *      await browser.navigateTo('https://duckduckgo.com/');
   *
   *      const searchBoxElement = await browser.findElement('input[name=q]');
   *      await browser.executeScript(function(_searchBoxElement) {
   *        _searchBoxElement.setAttribute('onclick', 'throw new Error("Hello world!")');
   *      }, [searchBoxElement]);
   *
   *      await browser.elementIdClick(searchBoxElement.getId());
   *    });
   *  });
   *
   * @see https://nightwatchjs.org/guide/running-tests/catch-js-exceptions.html
   */
  captureBrowserExceptions(
    onExceptionCallback: (event: Protocol.Runtime.ExceptionThrownEvent) => void,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<IfUnknown<ReturnType, this>, null>;
}
export interface WindowNsCommands<ReturnType = unknown> {
  /**
   * Close the current window or tab. This can be useful when you're working with multiple windows/tabs open (e.g. an OAuth login).
   *
   * After closing a window or tab, you must switch back to a valid window handle (using `.window.switchTo()` command) in order to continue execution.
   *
   * @example
   * module.exports = {
   *  'close current window/tab': function (browser) {
   *     browser.window.close(function (result) {
   *       console.log('current window/tab closed successfully');
   *     });
   *   },
   *
   *   'close current window/tab with ES6 async/await': async function (browser) {
   *     await browser.window.close();
   *   }
   * };
   */
  close(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Opens a new tab (default) or a separate new window, and changes focus to the newly opened tab/window.
   *
   * This command is only available for W3C Webdriver compatible browsers.
   *
   * @example
   * module.exports = {
   *  'open a new tab/window': function (browser) {
   *     // open a new tab (default)
   *     browser.window.open(function () {
   *       console.log('new tab opened successfully');
   *     });
   *
   *     // open a new window
   *     browser.window.open('window', function () {
   *       console.log('new window opened successfully');
   *     });
   *   },
   *
   *   'open a new tab/window ES6 async demo Test': async function (browser) {
   *     // open a new tab (default)
   *     await browser.window.open();
   *
   *     // open a new window
   *     await browser.window.open('window');
   *   }
   * };
   *
   * @alias window.openNew
   */
  open(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;
  open(
    type: "window" | "tab",
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Opens a new tab (default) or a separate new window, and changes focus to the newly opened tab/window.
   *
   * This command is only available for W3C Webdriver compatible browsers.
   *
   * @example
   * module.exports = {
   *  'open a new tab/window': function (browser) {
   *     // open a new tab (default)
   *     browser.window.openNew(function () {
   *       console.log('new tab opened successfully');
   *     });
   *
   *     // open a new window
   *     browser.window.openNew('window', function () {
   *       console.log('new window opened successfully');
   *     });
   *   },
   *
   *   'open a new tab/window ES6 async demo Test': async function (browser) {
   *     // open a new tab (default)
   *     await browser.window.openNew();
   *
   *     // open a new window
   *     await browser.window.openNew('window');
   *   }
   * };
   *
   * @alias window.open
   */
  openNew(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;
  openNew(
    type: "window" | "tab",
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Retrieve the current window handle.
   *
   * WebDriver does not make the distinction between windows and tabs. So, if your site opens a new tab or window, you can work with it using a window handle.
   *
   * @example
   * module.exports = {
   *  'get current window handle': function (browser) {
   *     browser.window.getHandle(function (result) {
   *       console.log('current window handle is:', result.value);
   *     });
   *   },
   *
   *   'get current window handle with ES6 async/await': async function (browser) {
   *     const windowHandle = await browser.window.getHandle();
   *     console.log('current window handle is:', windowHandle);
   *   }
   * };
   */
  getHandle(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<string>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, string>;

  /**
   * Retrieve the list of all window handles available to the session.
   *
   * @example
   * module.exports = {
   *  'get all window handles': function (browser) {
   *     browser.window.getAllHandles(function (result) {
   *       console.log('available window handles are:', result.value);
   *     });
   *   },
   *
   *   'get all window handles with ES6 async/await': async function (browser) {
   *     const windowHandles = await browser.window.getAllHandles();
   *     console.log('available window handles are:', windowHandles);
   *   }
   * };
   */
  getAllHandles(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<string[]>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, string[]>;

  /**
   * Change focus to another window.
   *
   * The window to change focus to must be specified by its server assigned window handle. To find out the window handle, use `window.getAllHandles()` command.
   *
   * @example
   * module.exports = {
   *  'switch to another window': function (browser) {
   *     browser
   *       .navigateTo('https://nightwatchjs.org/__e2e/window/')
   *       .click('#openWindowBttn')
   *       .waitUntil(function () {
   *         // wait until window handle for the new window is available
   *         return new Promise((resolve) => {
   *           browser.window.getAllHandles(function (result) {
   *             resolve(result.value.length === 2);
   *           });
   *         });
   *       })
   *       .perform(async function () {
   *         const originalWindow = await browser.window.getHandle();
   *         const allWindows = await browser.window.getAllHandles();
   *
   *         // loop through to find the new window handle
   *         for (const windowHandle of allWindows) {
   *           if (windowHandle !== originalWindow) {
   *             await browser.window.switchTo(windowHandle);
   *             break;
   *           }
   *         }
   *
   *         const currentWindow = await browser.window.getHandle();
   *         browser.assert.notEqual(currentWindow, originalWindow);
   *       });
   *   },
   *
   *   'switch to another window with ES6 async/await': async function (browser) {
   *     await browser.navigateTo('https://nightwatchjs.org/__e2e/window/');
   *     await browser.click('#openWindowBttn');
   *
   *     // wait until window handle for the new window is available
   *     await browser.waitUntil(async function () {
   *       const windowHandles = await browser.window.getAllHandles();
   *
   *       return windowHandles.length === 2;
   *     });
   *
   *     const originalWindow = await browser.window.getHandle();
   *     const allWindows = await browser.window.getAllHandles();
   *
   *     // loop through available windows to find the new window handle
   *     for (const windowHandle of allWindows) {
   *       if (windowHandle !== originalWindow) {
   *         await browser.window.switchTo(windowHandle);
   *         break;
   *       }
   *     }
   *
   *     const currentWindow = await browser.window.getHandle();
   *     await browser.assert.notEqual(currentWindow, originalWindow);
   *   }
   * };
   *
   * @alias window.switch
   */
  switchTo(
    windowHandle: string,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;
  switch(
    windowHandle: string,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Increases the window to the maximum available size without going full-screen.
   *
   * @example
   * module.exports = {
   *  'maximize current window': function (browser) {
   *     browser.window.maximize(function () {
   *       console.log('window maximized successfully');
   *     });
   *   },
   *
   *   'maximize current window using ES6 async/await': async function (browser) {
   *     await browser.window.maximize();
   *   }
   * };
   */
  maximize(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Hides the window in the system tray. If the window happens to be in fullscreen mode,
   * it is restored the normal state then it will be "iconified" - minimize or hide the window from the visible screen.
   *
   * @example
   * module.exports = {
   *  'minimize current window': function (browser) {
   *     browser.window.minimize(function () {
   *       console.log('window minimized successfully');
   *     });
   *   },
   *
   *   'minimize current window using ES6 async/await': async function (browser) {
   *     await browser.window.minimize();
   *   }
   * };
   */
  minimize(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Set the current window state to fullscreen, similar to pressing F11 in most browsers.
   *
   * @example
   * module.exports = {
   *  'make current window fullscreen': function (browser) {
   *     browser.window.fullscreen(function () {
   *       console.log('window in fullscreen mode');
   *     });
   *   },
   *
   *   'make current window fullscreen with ES6 async/await': async function (browser) {
   *     await browser.window.fullscreen();
   *   }
   * };
   */
  fullscreen(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Get the coordinates of the top left corner of the current window.
   *
   * @example
   * module.exports = {
   *   'get current window position': function (browser) {
   *      browser.window.getPosition(function (result) {
   *        console.log('Position of current window:', result.value.x, result.value.y);
   *      });
   *   },
   *
   *   'get current window position using ES6 async/await': async function (browser) {
   *      const {x, y} = await browser.window.getPosition();
   *      console.log('Position of current window:', x, y);
   *   }
   * };
   */
  getPosition(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<WindowPosition>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, WindowPosition>;

  /**
   * Get the size of the current window in pixels.
   *
   * @example
   * module.exports = {
   *   'get current window size': function (browser) {
   *      browser.window.getSize(function (result) {
   *        console.log('Size of current window:', result.value.width, result.value.height);
   *      });
   *   },
   *
   *   'get current window size using ES6 async/await': async function (browser) {
   *      const {width, height} = await browser.window.getSize();
   *      console.log('Size of current window:', width, height);
   *   }
   * };
   */
  getSize(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<WindowSize>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, WindowSize>;

  /**
   * Fetches the [window rect](https://w3c.github.io/webdriver/#dfn-window-rect) - size and position of the current window.
   *
   * Its JSON representation is the following:
   * - `x` - window's screenX attribute;
   * - `y` - window's screenY attribute;
   * - `width` - outerWidth attribute;
   * - `height` - outerHeight attribute.
   *
   * All attributes are in CSS pixels.
   *
   * @example
   * module.exports = {
   *   'get current window rect': function (browser) {
   *      browser.window.getRect(function (result) {
   *        console.log('Size of current window:', result.value.width, result.value.height);
   *        console.log('Position of current window:', result.value.x, result.value.y);
   *      });
   *   },
   *
   *   'get current window rect using ES6 async/await': async function (browser) {
   *      const {width, height, x, y} = await browser.window.getRect();
   *      console.log('Size of current window:', width, height);
   *      console.log('Position of current window:', x, y);
   *   }
   * };
   */
  getRect(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<WindowSizeAndPosition>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, WindowSizeAndPosition>;

  /**
   * Set the position of the current window - move the window to the chosen position.
   *
   * @example
   * module.exports = {
   *   'set current window position': function (browser) {
   *      // Move the window to the top left of the primary monitor
   *      browser.window.setPosition(0, 0, function (result) {
   *        console.log('window moved successfully');
   *      });
   *   },
   *
   *   'set current window position using ES6 async/await': async function (browser) {
   *      // Move the window to the top left of the primary monitor
   *      await browser.window.setPosition(0, 0);
   *   }
   * };
   */
  setPosition(
    x: number,
    y: number,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Set the size of the current window in CSS pixels.
   *
   * @example
   * module.exports = {
   *   'set current window size': function (browser) {
   *      browser.window.setSize(1024, 768, function (result) {
   *        console.log('window resized successfully');
   *      });
   *   },
   *
   *   'set current window size using ES6 async/await': async function (browser) {
   *      await browser.window.setSize(1024, 768);
   *   }
   * };
   *
   * @alias window.resize
   */
  setSize(
    width: number,
    height: number,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Set the size of the current window in CSS pixels.
   *
   * @example
   * module.exports = {
   *   'set current window size': function (browser) {
   *      browser.window.setSize(1024, 768, function (result) {
   *        console.log('window resized successfully');
   *      });
   *   },
   *
   *   'set current window size using ES6 async/await': async function (browser) {
   *      await browser.window.setSize(1024, 768);
   *   }
   * };
   *
   * @alias window.setSize
   */
  resize(
    width: number,
    height: number,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;

  /**
   * Change the [window rect](https://w3c.github.io/webdriver/#dfn-window-rect) - size and position of the current window.
   *
   * Its JSON representation is the following:
   * - `x` - window's screenX attribute;
   * - `y` - window's screenY attribute;
   * - `width` - outerWidth attribute;
   * - `height` - outerHeight attribute.
   *
   * All attributes are in CSS pixels.
   *
   * To change the window rect, you can either specify `width` and `height` together, `x` and `y` together, or all properties together.
   *
   * @example
   * module.exports = {
   *   'set current window rect': function (browser) {
   *      // Change the screenX and screenY attributes of the window rect.
   *      browser.window.setRect({x: 500, y: 500});
   *
   *      // Change the outerWidth and outerHeight attributes of the window rect.
   *      browser.window.setRect({width: 600, height: 300});
   *   },
   *
   *   'set current window rect using ES6 async/await': async function (browser) {
   *      // Change all attributes of the window rect at once.
   *      await browser.window.setRect({
   *        width: 600,
   *        height: 300,
   *        x: 100,
   *        y: 100
   *      });
   *   }
   * };
   */
  setRect(
    options: WindowSize | WindowPosition | WindowSizeAndPosition,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<IfUnknown<ReturnType, this>, null>;
}

export interface WebDriverProtocol
  extends WebDriverProtocolSessions,
  WebDriverProtocolNavigation,
  WebDriverProtocolCommandContexts,
  WebDriverProtocolElements,
  WebDriverProtocolElementState,
  WebDriverProtocolElementInteraction,
  WebDriverProtocolElementLocation,
  WebDriverProtocolDocumentHandling,
  WebDriverProtocolCookies,
  WebDriverProtocolUserActions,
  WebDriverProtocolUserPrompts,
  WebDriverProtocolScreenCapture,
  WebDriverProtocolMobileRelated { }

export interface NightwatchServerStatusResult {
  build: { version: string; revision: string; time: string };
  status: { arch: string; name: string; version: string };
}

export interface WebDriverProtocolSessions {
  /**
   * Get info about, delete or create a new session. Defaults to the current session.
   *
   * @example
   * this.demoTest = function (browser) {
   *    browser.session(function(result) {
   *      console.log(result.value);
   *    });
   *    //
   *    browser.session('delete', function(result) {
   *      console.log(result.value);
   *    });
   *    //
   *    browser.session('delete', '12345-abc', function(result) {
   *      console.log(result.value);
   *    });
   * }
   *
   * @see https://nightwatchjs.org/api/session.html#apimethod-container
   */
  session(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<Record<string, any>>
    ) => void
  ): Awaitable<this, Record<string, any>>;
  session(
    actionOrSessionId: "get" | "post" | "delete" | "GET" | "POST" | "DELETE" | string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<Record<string, any>>
    ) => void,
  ): Awaitable<this, Record<string, any>>;
  session(
    action: "get" | "post" | "delete" | "GET" | "POST" | "DELETE",
    sessionId: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<Record<string, any>>
    ) => void,
  ): Awaitable<this, Record<string, any>>;

  /**
   * Returns a list of the currently active sessions.
   *
   * @example
   *  this.demoTest = function (browser) {
   *    browser.sessions(function(result) {
   *      console.log(result.value);
   *    });
   *  }
   *
   * @see https://nightwatchjs.org/api/sessions.html
   */
  sessions(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<Array<Record<string, any>>>
    ) => void
  ): Awaitable<this, Array<Record<string, any>>>;

  /**
   * Configure the amount of time that a particular type of operation can execute for before they are aborted and a |Timeout| error is returned to the client.
   *
   * @example
   *  this.demoTest = function (browser) {
   *    browser.timeouts('script', 10000, function(result) {
   *      console.log(result);
   *    });
   *  }
   *
   * @see https://nightwatchjs.org/api/timeouts.html
   */
  timeouts(
    typeOfOperation: 'script' | 'implicit' | 'pageLoad',
    ms: number,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void,
  ): Awaitable<this, null>;
  timeouts(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<{ script: number, implicit: number, pageLoad: number }>
    ) => void
  ): Awaitable<this, { script: number, implicit: number, pageLoad: number }>;

  /**
   * Set the amount of time, in milliseconds, that asynchronous scripts executed by `.executeAsync` are permitted to run before they are aborted and a |Timeout| error is returned to the client.
   *
   * @example
   *  this.demoTest = function (browser) {
   *    browser.timeoutsAsyncScript(10000, function(result) {
   *      console.log(result);
   *    });
   *  }
   *
   * @see https://nightwatchjs.org/api/timeoutsAsyncScript.html
   */
  timeoutsAsyncScript(
    ms: number,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Set the amount of time the driver should wait when searching for elements. If this command is never sent, the driver will default to an implicit wait of 0ms.
   *
   * @example
   *  this.demoTest = function (browser) {
   *    browser.timeoutsImplicitWait(10000, function(result) {
   *      console.log(result);
   *    });
   *  }
   *
   * @see https://nightwatchjs.org/api/timeoutsImplicitWait.html
   */
  timeoutsImplicitWait(
    ms: number,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Query the server's current status.
   *
   * @see https://nightwatchjs.org/api/status.html
   */
  status(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<NightwatchServerStatusResult>,
    ) => void
  ): Awaitable<this, NightwatchServerStatusResult>;

  /**
   * Gets the text of the log type specified. To find out the available log types, use `.getLogTypes()`.
   *
   * Returns a [log entry JSON object](https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#log-entry-json-object).
   *
   * @example
   *  this.demoTest = function (browser) {
   *    browser.sessionLog('client', function(result) {
   *      console.log(result.value);
   *    });
   *  }
   *
   * @see https://nightwatchjs.org/api/sessionLog.html
   */
  sessionLog(
    typeString: string,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<NightwatchLogEntry[]>) => void
  ): Awaitable<this, NightwatchLogEntry[]>;

  /**
   * Gets an array of strings for which log types are available. This methods returns the entire WebDriver response, if you are only interested in the logs array, use `.getLogTypes()` instead.
   *
   * @example
   *  this.demoTest = function (browser) {
   *    browser.sessionLogTypes(function(result) {
   *      console.log(result.value);
   *    });
   *  }
   *
   * @see https://nightwatchjs.org/api/sessionLogTypes.html
   */
  sessionLogTypes(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<NightwatchLogTypes[]>
    ) => void
  ): Awaitable<this, NightwatchLogTypes[]>;
}

export interface WebDriverProtocolNavigation {
  /**
   * Retrieve the URL of the current page or navigate to a new URL.
   *
   * @example
   * module.exports = {
   *  'demo Test' : function(browser) {
   *     browser.url(function(result) {
   *       // return the current url
   *       console.log(result);
   *     });
   *     //
   *     // navigate to new url:
   *     browser.url('{URL}');
   *     //
   *     //
   *     // navigate to new url:
   *     browser.url('{URL}', function(result) {
   *       console.log(result);
   *     });
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/url.html
   */
  url(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;
  url(
    url: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Navigate backwards in the browser history, if possible.
   *
   * @see https://nightwatchjs.org/api/back.html
   */
  back(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Navigate forwards in the browser history, if possible.
   *
   * @see https://nightwatchjs.org/api/forward.html
   */
  forward(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Refresh the current page.
   *
   * @see https://nightwatchjs.org/api/refresh.html
   */
  refresh(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Get the current page title.
   *
   * @example
   *  this.demoTest = function (browser) {
   *    browser.title(function(result) {
   *      console.log(result.value);
   *    });
   *  }
   *
   * @see https://nightwatchjs.org/api/title.html
   */
  title(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;
}

export interface WebDriverProtocolCommandContexts {
  /**
   * Retrieve the current window handle.
   *
   * @example
   *  this.demoTest = function (browser) {
   *    browser.windowHandle(function(result) {
   *      console.log(result.value);
   *    });
   *  }
   *
   * @see https://nightwatchjs.org/api/windowHandle.html
   *
   * @deprecated In favour of `.window.getHandle()`.
   */
  windowHandle(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;

  /**
   * Retrieve the list of all window handles available to the session.
   *
   * @example
   *  this.demoTest = function (browser) {
   *    browser.windowHandles(function(result) {
   *      // An array of window handles.
   *      console.log(result.value);
   *    });
   *  }
   *
   * @see https://nightwatchjs.org/api/windowHandles.html
   *
   * @deprecated In favour of `.window.getAllHandles()`.
   */
  windowHandles(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string[]>
    ) => void
  ): Awaitable<this, string[]>;

  /**
   * Increases the window to the maximum available size without going full-screen.
   *
   * @example
   *  this.demoTest = function (browser) {
   *    browser.windowMaximize('current', function(result) {
   *      console.log(result);
   *    });
   *  }
   *
   * @see https://nightwatchjs.org/api/windowMaximize.html
   *
   * @deprecated In favour of `.window.maximize()`.
   */
  windowMaximize(
    handleOrName?: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Change or get the position of the specified window. If the second argument is a function it will be used as a callback and
   * the call will perform a get request to retrieve the existing window position.
   *
   * @example
   *  this.demoTest = function (browser) {
   *
   *    // Change the position of the specified window.
   *    // If the :windowHandle URL parameter is "current", the currently active window will be moved.
   *    browser.windowPosition('current', 0, 0, function(result) {
   *      console.log(result);
   *    });
   *
   *    // Get the position of the specified window.
   *    // If the :windowHandle URL parameter is "current", the position of the currently active window will be returned.
   *    browser.windowPosition('current', function(result) {
   *      console.log(result.value);
   *    });
   *  }
   *
   * @see https://nightwatchjs.org/api/windowPosition.html
   *
   * @deprecated In favour of `.window.getPosition()` and `.window.setPosition()`.
   */
  windowPosition(
    windowHandle: string,
    offsetX: number,
    offsetY: number,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  windowPosition(
    windowHandle: string,
    callback: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<WindowPosition>
    ) => void
  ): Awaitable<this, WindowPosition>;

  /**
   * Change or get the size of the specified window. If the second argument is a function it will be used as a callback and the call will perform a get request to retrieve the existing window size.
   *
   * @example
   *  this.demoTest = function (browser) {
   *
   *    // Return the size of the specified window. If the :windowHandle URL parameter is "current", the size of the currently active window will be returned.
   *    browser.windowSize('current', function(result) {
   *      console.log(result.value);
   *    });
   *
   *    // Change the size of the specified window.
   *    // If the :windowHandle URL parameter is "current", the currently active window will be resized.
   *    browser.windowSize('current', 300, 300, function(result) {
   *      console.log(result.value);
   *    });
   *  }
   *
   * @see https://nightwatchjs.org/api/windowSize.html
   *
   * @deprecated In favour of `.window.getSize()` and `.window.setSize()`.
   */
  windowSize(
    windowHandle: string,
    width: number,
    height: number,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  windowSize(
    windowHandle: string,
    callback: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<WindowSizeAndPosition>
    ) => void
  ): Awaitable<this, WindowSizeAndPosition>;

  /**
   * Change or get the [window rect](https://w3c.github.io/webdriver/#dfn-window-rect).
   * This is defined as a dictionary of the `screenX`, `screenY`, `outerWidth` and `outerHeight` attributes of the window.
   *
   * Its JSON representation is the following:
   * - `x` - window's screenX attribute;
   * - `y` - window's screenY attribute;
   * - `width` - outerWidth attribute;
   * - `height` - outerHeight attribute.
   *
   * All attributes are in in CSS pixels. To change the window react, you can either specify `width` and `height`, `x` and `y` or all properties together.
   *
   * @example
   * module.exports = {
   *   'demo test .windowRect()': function(browser) {
   *
   *      // Change the screenX and screenY attributes of the window rect.
   *      browser.windowRect({x: 500, y: 500});
   *
   *      // Change the width and height attributes of the window rect.
   *      browser.windowRect({width: 600, height: 300});
   *
   *      // Retrieve the attributes
   *      browser.windowRect(function(result) {
   *        console.log(result.value);
   *      });
   *   },
   *
   *   'windowRect ES6 demo test': async function(browser) {
   *      const resultValue = await browser.windowRect();
   *      console.log('result value', resultValue);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/windowRect.html
   *
   * @deprecated In favour of `.window.getRect()` and `.window.setRect()`.
   */
  windowRect(
    options: { width?: number; height?: number; x?: number; y?: number },
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  windowRect(
    options: null,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<WindowSizeAndPosition>
    ) => void,
  ): Awaitable<this, WindowSizeAndPosition>;

  /**
   * Change focus to another frame on the page. If the frame id is missing or null, the server should switch to the page's default content.
   *
   * @example
   *  this.demoTest = function (browser) {
   *    browser.frame('<ID>', function(result) {
   *      console.log(result);
   *    });
   *  }
   *
   * @see https://nightwatchjs.org/api/frame.html
   */
  frame(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void,
  ): Awaitable<this, null>;
  frame(
    frameId: WebElement | string | number | null,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void,
  ): Awaitable<this, null>;

  /**
   * Change focus to the parent context. If the current context is the top level browsing context, the context remains unchanged.
   *
   * @example
   *  this.demoTest = function (browser) {
   *    browser.frameParent(function(result) {
   *      console.log(result);
   *    });
   *  }
   *
   * @see https://nightwatchjs.org/api/frameParent.html
   *
   * @since v0.4.8
   */
  frameParent(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
}

export interface WebDriverProtocolElements {
  /**
   * Provides access to Nightwatch new element API.
   *
   * @example
   * module.exports = {
   *   'new element api': function (browser) {
   *     // Using element as function.
   *     const button1 = browser.element('button.submit-form');
   *
   *     // Using the find method of the element namespace.
   *     const button2 = browser.element.find('button.submit-form');
   *     // Searching for the icon element inside the .submit-form button.
   *     const icon = button2.find('i');
   *
   *     // Use an object to customise locating behaviour.
   *     const main = browser.element({ selector: 'main', locateStrategy: 'css selector' });
   *   },
   *
   *   'new element api async': function (browser) {
   *     // button is the WebElement object.
   *     const button = await browser.element('button.submit-form');
   *   },
   *
   *   'with backward compatibility': function (browser) {
   *     // for backward compatibility
   *     browser.element('css selector', 'body');
   *   }
   * }
   */
  element: ElementFunction;

  /**
   * Search for multiple elements on the page, starting from the document root. The located elements will be returned as web element JSON objects.
   * First argument to be passed is the locator strategy, which is detailed on the [WebDriver docs](https://www.w3.org/TR/webdriver/#locator-strategies).
   *
   * * The locator strategy can be one of:
   * - `css selector`
   * - `link text`
   * - `partial link text`
   * - `tag name`
   * - `xpath`
   *
   * @example
   * module.exports = {
   *  'demo Test' : function(browser) {
   *     browser.elements('css selector', 'ul li', function(result) {
   *       console.log(result.value)
   *     });
   *   },
   *
   *   'es6 async demo Test': async function(browser) {
   *     const result = await browser.elements('css selector', 'ul li');
   *     console.log('result value is:', result);
   *   },
   *
   *   'page object demo Test': function (browser) {
   *      var nightwatch = browser.page.nightwatch();
   *      nightwatch
   *        .navigate()
   *        .assert.titleContains('Nightwatch.js');
   *
   *      nightwatch.api.elements('@featuresList', function(result) {
   *        console.log(result);
   *      });
   *
   *      browser.end();
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/elements.html
   */
  elements(
    using: LocateStrategy,
    value: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<ElementResult[]>
    ) => void
  ): Awaitable<this, ElementResult[]>;

  /**
   * Search for an element on the page, starting from the identified element. The located element will be returned as a Web Element JSON object.
   *
   * This command operates on a protocol level and requires a [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements).
   * Read more on [Element retrieval](https://www.w3.org/TR/webdriver1/#element-retrieval) on the W3C WebDriver spec page.
   *
   * @example
   * module.exports = {
   *  'demo Test' : function(browser) {
   *     browser.findElement('.some-element', (result) => {
   *       this.elementIdElement(result.value.getId(), 'css selector', '.new-element', function(result) {
   *         console.log(result.value);
   *       });
   *     });
   *   },
   *
   *   'es6 async demo Test': async function(browser) {
   *     const elementObject = await browser.findElement('.some-element');
   *     const result = await browser.elementIdElement(elementId.getId(), 'css selector', '.new-element');
   *     console.log(result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/elementIdElement.html
   */
  elementIdElement(
    id: string,
    using: LocateStrategy,
    value: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<ElementResult | []>
    ) => void
  ): Awaitable<this, ElementResult | []>;

  /**
   * Search for multiple elements on the page, starting from the identified element. The located element will be returned as a web element JSON objects.
   *
   * @example
   * module.exports = {
   *  'demo Test' : function(browser) {
   *     browser.findElement('#main', (result) => {
   *       browser.elementIdElements(result.value.getId(), 'css selector', 'ul li', function(result) {
   *         console.log(result.value)
   *       });
   *     });
   *   },
   *
   *   'es6 async demo Test': async function(browser) {
   *     const elementObject = await browser.findElement('#main');
   *     const result = await browser.elementIdElements(elementObject.getId(), 'css selector', 'ul li');
   *     console.log(result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/elementIdElements.html
   */
  elementIdElements(
    id: string,
    using: LocateStrategy,
    value: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<ElementResult[]>
    ) => void
  ): Awaitable<this, ElementResult[]>;

  /**
   * Move to the element and performs a double-click in the middle of the given element if
   * element is given else double-clicks at the current mouse coordinates (set by `.moveTo()`).
   *
   */
  elementIdDoubleClick(
    webElementId: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Retrieve the value of a specified DOM property for the given element.
   * For all the available DOM element properties, consult the [Element doc at MDN](https://developer.mozilla.org/en-US/docs/Web/API/element).
   */
  elementIdProperty(
    webElementId: string,
    DOMPropertyName: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<any>
    ) => void
  ): Awaitable<this, any>;

  /**
   * Test if two web element IDs refer to the same DOM element.
   *
   * This command is __deprecated__ and is only available on the [JSON Wire protocol](https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidequalsother)
   *
   * @example
   * module.exports = {
   *  'demo Test' : function(browser) {
   *     browser.elementIdEquals('<ID-1>', '<ID-2>', function(result) {
   *       console.log(result.value)
   *     });
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/elementIdEquals.html
   *
   * @deprecated In favour of WebElement.equals(a, b) from Selenium Webdriver.
   */
  elementIdEquals(
    id: string,
    otherId: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<boolean>
    ) => void
  ): Awaitable<this, boolean>;

  /**
   * Get the element on the page that currently has focus.
   * The element will be returned as a [Web Element](https://www.w3.org/TR/webdriver1/#dfn-web-elements) id.
   *
   * @example
   * module.exports = {
   *  'demo Test' : function(browser) {
   *     browser.elementActive(function(result) {
   *       console.log(result.value)
   *     });
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/elementActive.html
   */
  elementActive(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;
}

export interface WebDriverProtocolElementState {
  /**
   * Get the value of an element's attribute.
   *
   * @see https://nightwatchjs.org/api/elementIdAttribute.html
   */
  elementIdAttribute(
    id: string,
    attributeName: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string | null>
    ) => void
  ): Awaitable<this, string | null>;

  /**
   * Retrieve the computed value of the given CSS property of the given element.
   *
   * The CSS property to query should be specified using the CSS property name, not the JavaScript property name (e.g. background-color instead of backgroundColor).
   *
   * @see https://nightwatchjs.org/api/elementIdCssProperty.html
   */
  elementIdCssProperty(
    id: string,
    cssPropertyName: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;

  /**
   * Determine if an element is currently displayed.
   *
   * @see https://nightwatchjs.org/api/elementIdDisplayed.html
   */
  elementIdDisplayed(
    id: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<boolean>
    ) => void
  ): Awaitable<this, boolean>;

  /**
   * Determine if an element is currently enabled.
   *
   * @see https://nightwatchjs.org/api/elementIdEnabled.html
   */
  elementIdEnabled(
    id: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<boolean>
    ) => void
  ): Awaitable<this, boolean>;

  /**
   * Retrieve the qualified tag name of the given element.
   *
   * @see https://nightwatchjs.org/api/elementIdName.html
   */
  elementIdName(
    id: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;

  /**
   * Determine if an OPTION element, or an INPUT element of type checkbox or radio button is currently selected.
   *
   * @see https://nightwatchjs.org/api/elementIdSelected.html
   */
  elementIdSelected(
    id: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<boolean>
    ) => void
  ): Awaitable<this, boolean>;

  /**
   * Determine an element's size in pixels. The size will be returned as a JSON object with width and height properties.
   *
   * @see https://nightwatchjs.org/api/elementIdSize.html
   *
   * @deprecated In favour of .getElementRect()
   */
  elementIdSize(
    id: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<NightwatchSizeAndPosition>
    ) => void
  ): Awaitable<this, NightwatchSizeAndPosition>;

  /**
   * Returns the visible text for the element.
   *
   * @see https://nightwatchjs.org/api/elementIdText.html
   */
  elementIdText(
    id: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;
}

export interface WebDriverProtocolElementInteraction {
  /**
   * Scrolls into view a submittable element excluding buttons or editable element, and then attempts to clear its value, reset the checked state, or text content.
   *
   * @example
   * browser.elementIdClear(elementId);
   *
   * @see https://nightwatchjs.org/api/elementIdClear.html
   */
  elementIdClear(
    id: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Scrolls into view the element and clicks the in-view center point.
   * If the element is not pointer-interactable,
   * an <code>element not interactable</code> error is returned.
   *
   * @example
   * browser.elementIdClick(elementId);
   *
   * @see https://nightwatchjs.org/api/elementIdClick.html
   */
  elementIdClick(
    id: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Scrolls into view the form control element and then sends the provided keys to the element, or returns the current value of the element.
   * In case the element is not keyboard interactable, an <code>element not interactable error</code> is returned.
   *
   * @see https://nightwatchjs.org/api/elementIdValue.html
   *
   * @deprecated In favour of .getValue() and .setValue()
   */
  elementIdValue(
    id: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;
  elementIdValue(
    id: string,
    value: string | string[],
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Send a sequence of key strokes to the active element. The sequence is defined in the same format as the `sendKeys` command.
   * An object map with available keys and their respective UTF-8 characters, as defined on [W3C WebDriver draft spec](https://www.w3.org/TR/webdriver/#character-types),
   * is loaded onto the main Nightwatch instance as `client.Keys`.
   *
   * Rather than the `setValue`, the modifiers are not released at the end of the call. The state of the modifier keys is kept between calls,
   * so mouse interactions can be performed while modifier keys are depressed.
   *
   * Since v2.0, this command is deprecated. It is only available on older JSONWire-based drivers.
   * Please use the new [User Actions API](https://nightwatchjs.org/api/useractions/).
   *
   * @example
   * browser
   * .keys(browser.Keys.CONTROL) // hold down CONTROL key
   * .click('#element')
   * .keys(browser.Keys.NULL) // release all keys
   *
   * @see https://nightwatchjs.org/api/keys.html
   *
   * @deprecated Please use the new [User Actions API](https://nightwatchjs.org/api/useractions/) instead.
   */
  keys(
    keysToSend: string | string[],
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Submit a FORM element. The submit command may also be applied to any element that is a descendant of a FORM element.
   *
   * @example
   * browser.submit(elementID);
   *
   * @see https://nightwatchjs.org/api/submit.html
   */
  submit(
    id: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
}

export interface WebDriverProtocolElementLocation {
  /**
   * Determine an element's location on the page. The point (0, 0) refers to the upper-left corner of the page.
   *
   * The element's coordinates are returned as a JSON object with x and y properties.
   *
   * @see https://nightwatchjs.org/api/elementIdLocation.html
   *
   * @deprecated In favour of .getElementRect()
   */
  elementIdLocation(
    id: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<NightwatchSizeAndPosition>
    ) => void
  ): Awaitable<this, NightwatchSizeAndPosition>;

  /**
   * Determine an element's location on the screen once it has been scrolled into view.
   *
   * @see https://nightwatchjs.org/api/elementIdLocationInView.html#apimethod-container
   *
   * @deprecated This is JSON Wire Protocol command and is no longer supported.
   */
  elementIdLocationInView(
    id: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<NightwatchPosition>
    ) => void
  ): Awaitable<this, NightwatchPosition>;
}

export interface WebDriverProtocolDocumentHandling {
  /**
   * Returns a string serialisation of the DOM of the current page.
   *
   * @example
   * browser.source();
   *
   * @see https://nightwatchjs.org/api/source.html
   *
   * @deprecated In favour of `.document.source()`.
   */
  source(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;

  /**
   * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame. The executed script is assumed to be synchronous.
   * The script argument defines the script to execute in the form of a function body. The value returned by that function will be returned to the client.
   *
   * The function will be invoked with the provided args array and the values may be accessed via the arguments object in the order specified.
   *
   * Under the hood, if the `body` param is a function it is converted to a string with `<function>.toString()`. Any references to your current scope are ignored.
   *
   * To ensure cross-browser compatibility, the specified function should not be in ES6 format (i.e. `() => {}`).
   * If the execution of the function fails, the first argument of the callback contains error information.
   *
   * @example
   *  this.demoTest = function (browser) {
   *    browser.execute(function(imageData: string) {
   *      // resize operation
   *      return true;
   *    }, [imageData], function(result) {
   *      // result.value === true
   *    });
   * }
   *
   * @see https://nightwatchjs.org/api/execute.html#apimethod-container
   *
   * @alias executeScript
   */
  execute<ReturnValue>(
    body: ExecuteScriptFunction<[], ReturnValue> | string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<VoidToNull<ReturnValue>>
    ) => void,
  ): Awaitable<this, VoidToNull<ReturnValue>>;
  execute<ArgType extends any[], ReturnValue>(
    body: ExecuteScriptFunction<ArgType, ReturnValue> | string,
    args: ArgType,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<VoidToNull<ReturnValue>>
    ) => void,
  ): Awaitable<this, VoidToNull<ReturnValue>>;

  /**
   * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame. The executed script is assumed to be synchronous.
   * The script argument defines the script to execute in the form of a function body. The value returned by that function will be returned to the client.
   *
   * The function will be invoked with the provided args array and the values may be accessed via the arguments object in the order specified.
   *
   * Under the hood, if the `body` param is a function it is converted to a string with `<function>.toString()`. Any references to your current scope are ignored.
   *
   * To ensure cross-browser compatibility, the specified function should not be in ES6 format (i.e. `() => {}`).
   * If the execution of the function fails, the first argument of the callback contains error information.
   *
   * @example
   *  this.demoTest = function (browser) {
   *    browser.executeScript(function(imageData: string) {
   *      // resize operation
   *      return true;
   *    }, [imageData], function(result) {
   *      // result.value === true
   *    });
   * }
   *
   * @see https://nightwatchjs.org/api/execute.html#apimethod-container
   *
   * @alias execute
   */
  executeScript<ReturnValue>(
    body: ExecuteScriptFunction<[], ReturnValue> | string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<VoidToNull<ReturnValue>>
    ) => void,
  ): Awaitable<this, VoidToNull<ReturnValue>>;
  executeScript<ArgType extends any[], ReturnValue>(
    body: ExecuteScriptFunction<ArgType, ReturnValue> | string,
    args: ArgType,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<VoidToNull<ReturnValue>>
    ) => void,
  ): Awaitable<this, VoidToNull<ReturnValue>>;

  /**
   *
   * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame.
   * The executed script is assumed to be asynchronous.
   *
   * The function to be injected receives the `done` callback as argument which needs to be called
   * when the asynchronous operation finishes. The value passed to the `done` callback is returned to the client.
   * Additional arguments for the injected function may be passed as a non-empty array which
   * will be passed before the `done` callback.
   *
   * Asynchronous script commands may not span page loads. If an unload event is fired
   *  while waiting for the script result, an error will be returned.
   *
   * @example
   *  this.demoTest = function (browser) {
   *    browser.executeAsyncScript(function(done: (result: true) => void) {
   *      setTimeout(function() {
   *        done(true);
   *      }, 500);
   *    }, function(result) {
   *      // result.value === true
   *    });
   *
   *    browser.executeAsyncScript(function(arg1: string, arg2: number, done: (result: string) => void) {
   *      setTimeout(function() {
   *        done(arg1);
   *      }, 500);
   *    }, [arg1, arg2], function(result) {
   *      // result.value === arg1
   *    });
   * }
   *
   * @see https://nightwatchjs.org/api/executeAsyncScript.html
   *
   * @alias executeAsync
   */
  executeAsyncScript<ReturnValue>(
    script: ExecuteAsyncScriptFunction<[], ReturnValue> | string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<ReturnValue>
    ) => void,
  ): Awaitable<this, ReturnValue>;
  executeAsyncScript<ArgType extends any[], ReturnValue>(
    script: ExecuteAsyncScriptFunction<ArgType, ReturnValue> | string,
    args: ArgType,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<ReturnValue>
    ) => void,
  ): Awaitable<this, ReturnValue>;

  /**
   * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame. The executed script is assumed to be asynchronous.
   *
   * The function to be injected receives the `done` callback as argument which needs to be called when the asynchronous operation finishes.
   * The value passed to the `done` callback is returned to the client.
   * Additional arguments for the injected function may be passed as a non-empty array which will be passed before the `done` callback.
   *
   * Asynchronous script commands may not span page loads. If an unload event is fired while waiting for the script result, an error will be returned.
   *
   * @example
   *  this.demoTest = function (browser) {
   *    browser.executeAsync(function(done: (result: true) => void) {
   *      setTimeout(function() {
   *        done(true);
   *      }, 500);
   *    }, function(result) {
   *      // result.value === true
   *    });
   *
   *    browser.executeAsync(function(arg1: string, arg2: number, done: (result: string) => void) {
   *      setTimeout(function() {
   *        done(arg1);
   *      }, 500);
   *    }, [arg1, arg2], function(result) {
   *      // result.value === arg1
   *    });
   * }
   *
   * @see https://nightwatchjs.org/api/executeAsyncScript.html
   *
   * @alias executeAsyncScript
   */
  executeAsync<ReturnValue>(
    script: ExecuteAsyncScriptFunction<[], ReturnValue> | string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<ReturnValue>
    ) => void,
  ): Awaitable<this, ReturnValue>;
  executeAsync<ArgType extends any[], ReturnValue>(
    script: ExecuteAsyncScriptFunction<ArgType, ReturnValue> | string,
    args: ArgType,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<ReturnValue>
    ) => void,
  ): Awaitable<this, ReturnValue>;
}

export interface WebDriverProtocolCookies {
  /**
   * Retrieve or delete all cookies visible to the current page or set a cookie. Normally this shouldn't be used directly, instead the cookie convenience methods should be used:
   * <code>getCookie</code>, <code>getCookies</code>, <code>setCookie</code>, <code>deleteCookie</code>, <code>deleteCookies</code>.
   *
   * @see getCookies
   * @see getCookie
   * @see setCookie
   * @see deleteCookie
   * @see deleteCookies
   *
   * @deprecated
   */
  cookie(
    method: "GET" | "DELETE",
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<Cookie[] | null>) => void
  ): Awaitable<this, Cookie[] | null>;
  cookie(
    method: "POST",
    cookie: Cookie,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void
  ): Awaitable<this, null>;
  cookie(
    method: "DELETE",
    cookieName: string,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void
  ): Awaitable<this, null>;
}

export interface WebDriverProtocolUserActions {
  /**
   * Move to the element and peforms a double-click in the middle of the element.
   *
   * @example
   * module.exports = {
   *   demoTest() {
   *     browser.doubleClick('#main ul li a.first');
   *
   *     browser.doubleClick('#main ul li a.first', function(result) {
   *       console.log('double click result', result);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.doubleClick('css selector', '#main ul li a.first');
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.doubleClick({
   *       selector: '#main ul li a',
   *       index: 1,
   *       suppressNotFoundErrors: true
   *     });
   *
   *     browser.doubleClick({
   *       selector: '#main ul li a.first',
   *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
   *     });
   *   },
   *
   *   demoTestAsync: async function() {
   *     const result = await browser.doubleClick('#main ul li a.first');
   *     console.log('double click result', result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/doubleClick.html#apimethod-container
   */
  doubleClick(
    selector: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  doubleClick(
    using: LocateStrategy,
    selector: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Move to the element and click (without releasing) in the middle of the given element.
   *
   * @example
   * module.exports = {
   *   demoTest() {
   *     browser.clickAndHold('#main ul li a.first');
   *
   *     browser.clickAndHold('#main ul li a.first', function(result) {
   *       console.log('Click result', result);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.clickAndHold('css selector', '#main ul li a.first');
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.clickAndHold({
   *       selector: '#main ul li a',
   *       index: 1,
   *       suppressNotFoundErrors: true
   *     });
   *
   *     browser.clickAndHold({
   *       selector: '#main ul li a.first',
   *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
   *     });
   *   },
   *
   *   demoTestAsync: async function() {
   *     const result = await browser.clickAndHold('#main ul li a.first');
   *     console.log('Right click result', result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/clickAndHold.html#apimethod-container
   */
  clickAndHold(
    selector: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  clickAndHold(
    using: LocateStrategy,
    selector: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Release the depressed left mouse button at the current mouse coordinates (set by `.moveTo()`).
   *
   * @see https://nightwatchjs.org/api/releaseMouseButton.html#apimethod-container
   */
  releaseMouseButton(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Click at the current mouse coordinates (set by `.moveTo()`).
   *
   * The button can be (0, 1, 2) or ('left', 'middle', 'right'). It defaults to left mouse button.
   *
   * @see https://nightwatchjs.org/api/mouseButtonClick.html
   *
   * @deprecated Please use the new [User Actions API](https://nightwatchjs.org/api/useractions/) instead.
   */
  mouseButtonClick(
    button: 0 | 1 | 2 | 'left' | 'middle' | 'right',
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Click and hold the left mouse button (at the coordinates set by the last `moveTo` command). Note that the next mouse-related command that should follow is `mouseButtonUp` .
   * Any other mouse command (such as click or another call to buttondown) will yield undefined behaviour.
   *
   * Can be used for implementing drag-and-drop. The button can be (0, 1, 2) or ('left', 'middle', 'right'). It defaults to left mouse button,
   * and if you don't pass in a button but do pass in a callback, it will handle it correctly.
   *
   * **Since v2.0, this command is deprecated.** It is only available on older JSONWire-based drivers.
   * Please use the new [User Actions API](/api/useractions/).
   *
   * @see https://nightwatchjs.org/api/mouseButtonDown.html
   *
   * @deprecated Please use the new [User Actions API](https://nightwatchjs.org/api/useractions/) instead.
   */
  mouseButtonDown(
    button: 0 | 1 | 2 | 'left' | 'middle' | 'right',
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Releases the mouse button previously held (where the mouse is currently at). Must be called once for every `mouseButtonDown` command issued.
   *
   * Can be used for implementing drag-and-drop. The button can be (0, 1, 2) or ('left', 'middle', 'right'). It defaults to left mouse button,
   * and if you don't pass in a button but do pass in a callback, it will handle it correctly.
   *
   * **Since v2.0, this command is deprecated.** It is only available on older JSONWire-based drivers.
   * Please use the new [User Actions API](/api/useractions/).
   *
   * @see https://nightwatchjs.org/api/mouseButtonUp.html
   *
   * @deprecated Please use the new [User Actions API](https://nightwatchjs.org/api/useractions/) instead.
   */
  mouseButtonUp(
    button: 0 | 1 | 2 | 'left' | 'middle' | 'right',
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Move the mouse by an offset of the specified [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) or relative to the current mouse cursor, if no element is specified.
   * If an element is provided but no offset, the mouse will be moved to the center of the element.
   *
   * If an element is provided but no offset, the mouse will be moved to the center of the element. If the element is not visible, it will be scrolled into view.
   *
   * @example
   * this.demoTest = function (browser) {
   *   browser.moveTo(null, 110, 100);
   * };
   *
   * @see https://nightwatchjs.org/api/moveTo.html#apimethod-container
   */
  moveTo(
    elementId: string | null,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<this, null>;
  moveTo(
    xoffset: number,
    yoffset: number,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<this, null>;
  moveTo(
    elementId: string | null,
    xoffset: number,
    yoffset: number,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<null>) => void,
  ): Awaitable<this, null>;

  /**
   * Simulates a context-click(right click) event on the given DOM element.
   * The element is scrolled into view if it is not already pointer-interactable.
   * See the WebDriver specification for element [interactability](https://www.w3.org/TR/webdriver/#element-interactability).
   *
   * @example
   * module.exports = {
   *   demoTest() {
   *     browser.rightClick('#main ul li a.first');
   *
   *     browser.rightClick('#main ul li a.first', function(result) {
   *       console.log('Click result', result);
   *     });
   *
   *     // with explicit locate strategy
   *     browser.rightClick('css selector', '#main ul li a.first');
   *
   *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
   *     browser.rightClick({
   *       selector: '#main ul li a',
   *       index: 1,
   *       suppressNotFoundErrors: true
   *     });
   *
   *     browser.rightClick({
   *       selector: '#main ul li a.first',
   *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
   *     });
   *   },
   *
   *   demoTestAsync: async function() {
   *     const result = await browser.rightClick('#main ul li a.first');
   *     console.log('Right click result', result);
   *   }
   * }
   *
   * @see https://nightwatchjs.org/api/rightClick.html#apimethod-container
   */
  rightClick(
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
  rightClick(
    using: LocateStrategy,
    selector: Definition,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
}

export interface WebDriverProtocolUserPrompts {
  /**
   * Accepts the currently displayed alert dialog. Usually, this is equivalent to clicking on the 'OK' button in the dialog.
   *
   * @example
   * browser.acceptAlert()
   *
   * @see https://nightwatchjs.org/api/acceptAlert.html
   *
   * @deprecated In favour of `.alerts.accept()`.
   */
  acceptAlert(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Dismisses the currently displayed alert dialog. For confirm() and prompt() dialogs, this is equivalent to clicking the 'Cancel' button.
   *
   * For alert() dialogs, this is equivalent to clicking the 'OK' button.
   *
   * @example
   * browser.dismissAlert();
   *
   * @see https://nightwatchjs.org/api/dismissAlert.html
   *
   * @deprecated In favour of `.alerts.dismiss()`.
   */
  dismissAlert(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Gets the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog.
   *
   * @example
   * browser.getAlertText();
   *
   * @see https://nightwatchjs.org/api/getAlertText.html
   *
   * @deprecated In favour of `.alerts.getText()`.
   */
  getAlertText(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string>
    ) => void
  ): Awaitable<this, string>;

  /**
   * Sends keystrokes to a JavaScript prompt() dialog.
   *
   * @example
   * browser.setAlertText('randomalert');
   *
   * @see https://nightwatchjs.org/api/setAlertText.html
   *
   * @deprecated In favour of `.alerts.setText()`.
   */
  setAlertText(
    value: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;

  /**
   * Automate the input of basic auth credentials whenever they arise.
   *
   * @example
   *  this.demoTest = function (browser) {
   *    browser
   *      .registerBasicAuth('test-username', 'test-password')
   *      .navigateTo('http://browserspy.dk/password-ok.php');
   *  };
   *
   * @see https://nightwatchjs.org/api/registerBasicAuth.html#apimethod-container
   */
  registerBasicAuth(
    username: string,
    password: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
}

export interface WebDriverProtocolScreenCapture {
  /**
   * Take a screenshot of the current page.
   *
   * @example
   * browser.screenshot(true);
   */
  screenshot(
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<string>) => void,
  ): Awaitable<this, string>;
  screenshot(
    log_screenshot_data: boolean,
    callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<string>) => void,
  ): Awaitable<this, string>;
}

export interface WebDriverProtocolMobileRelated {
  /**
   * Get the current browser orientation.
   *
   * @example
   * browser.getOrientation()
   */
  getOrientation(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<'LANDSCAPE' | 'PORTRAIT'>
    ) => void
  ): Awaitable<this, 'LANDSCAPE' | 'PORTRAIT'>;

  /**
   * Sets the browser orientation.
   *
   * @example
   * browser.setOrientation(orientation)
   */
  setOrientation(
    orientation: 'LANDSCAPE' | 'PORTRAIT',
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<'LANDSCAPE' | 'PORTRAIT'>
    ) => void
  ): Awaitable<this, 'LANDSCAPE' | 'PORTRAIT'>;

  /**
   * Get a list of the available contexts.
   *
   * @example
   * browser.contexts();
   *
   * Used by Appium when testing hybrid mobile web apps. More info here: https://github.com/appium/appium/blob/master/docs/en/advanced-concepts/hybrid.md.
   */
  contexts(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string[]>
    ) => void
  ): Awaitable<this, string[]>;

  /**
   * Get current context.
   *
   * @example
   * browser.currentContext();
   */
  currentContext(
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<string | null>
    ) => void
  ): Awaitable<this, string | null>;

  /**
   * Sets the context.
   *
   * @example
   * browser.setContext(context);
   */
  setContext(
    context: string,
    callback?: (
      this: NightwatchAPI,
      result: NightwatchCallbackResult<null>
    ) => void
  ): Awaitable<this, null>;
}

// namespaced api
export const browser: NightwatchAPI;
export const app: NightwatchAPI;

export const appium: AppiumCommands;
export const cookies: CookiesNsCommands;
export const alerts: AlertsNsCommands;
export const document: DocumentNsCommands;
export const window: WindowNsCommands;
export const firefox: FirefoxNsCommands;
export const chrome: ChromeNsCommands;

export const assert: Assert;
export const verify: Assert;
export const expect: Expect;

export const element: ElementFunction;

declare const _default: Nightwatch;
export default _default;

declare global {
  const browser: NightwatchBrowser;
  const app: NightwatchAPI;
  const element: typeof globalElement;
  const by: typeof SeleniumBy;
  const By: typeof SeleniumBy;
  const ensure: Ensure;
  const expect: Expect;
  const locateWith: typeof seleniumLocateWith;
}
