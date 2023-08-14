import { NightwatchAPI } from './index';

/**
 * @see https://nightwatchjs.org/guide/concepts/test-globals.html#external-test-globals
 */
export interface NightwatchGlobals extends NightwatchInternalGlobals {
  /**
   * Custom Globals properties
   *
   * @example
   * myGlobalVar: "some value"
   */
  [key: string]: any;
}

export interface NightwatchInternalGlobals {
  /**
   * This controls whether to abort the test execution when an assertion failed and skip the rest
   * it's being used in waitFor commands and expect assertions
   *
   * @default true
   *
   * @example
   * abortOnAssertionFailure: true
   */
  abortOnAssertionFailure?: boolean;

  /**
   * This will overwrite the default polling interval (currently 500ms) for waitFor commands
   * and expect assertions that use retry
   *
   * @default 500
   *
   * @example
   * waitForConditionPollInterval: 500
   */
  waitForConditionPollInterval?: number;

  /**
   * Default timeout value in milliseconds for waitFor commands and implicit waitFor value for
   * expect assertions
   *
   * @default 5000
   *
   * @example
   * waitForConditionTimeout: 5000
   */
  waitForConditionTimeout?: number;

  /**
   * Since 1.4.0 – this controls whether to abort the test execution when an element cannot be located; an error
   * is logged in all cases, but this also enables skipping the rest of the testcase;
   * it's being used in element commands such as .click() or .getText()
   *
   * @default false
   *
   * @example
   * abortOnElementLocateError: false
   */
  abortOnElementLocateError?: boolean;

  /**
   * This will cause waitFor commands on elements to throw an error if multiple
   * elements are found using the given locate strategy and selector
   *
   * @default false
   *
   * @example
   * throwOnMultipleElementsReturned: false
   */
  throwOnMultipleElementsReturned?: boolean;

  /**
   * By default a warning is printed if multiple elements are found using the given locate strategy
   * and selector; set this to true to suppress those warnings
   *
   * @default false
   *
   * @example
   * suppressWarningsOnMultipleElementsReturned: false
   */
  suppressWarningsOnMultipleElementsReturned?: boolean;

  /**
   * Controls the timeout value for async hooks. Expects the done() callback to be invoked within this time
   * or an error is thrown
   *
   * @default 10000
   *
   * @example
   * asyncHookTimeout: 10000
   */
  asyncHookTimeout?: number;

  /**
   * Controls the timeout value for when running async unit tests. Expects the done() callback to be invoked within this time
   * or an error is thrown
   *
   * @default 2000
   *
   * @example
   * unitTestsTimeout: 2000
   */
  unitTestsTimeout?: number;

  /**
   * Controls the timeout value for when executing the global async reporter. Expects the done() callback to be
   * invoked within this time or an error is thrown
   *
   * @default 20000
   *
   * @example
   * customReporterCallbackTimeout: 20000
   */
  customReporterCallbackTimeout?: number;

  /**
   * Automatically retrying failed assertions - You can tell Nightwatch to automatically retry failed assertions
   * until a given timeout is reached, before the test runner gives up and fails the test.
   *
   * @default 5000
   *
   * @example
   * retryAssertionTimeout: 5000
   */
  retryAssertionTimeout?: number;

  /**
   * Use the same browser session to run the individual test suites
   *
   * @default false
   *
   * @example
   * reuseBrowserSession: false
   */
  reuseBrowserSession?: boolean;

  /**
   * Custom reporter
   *
   * @example
   *  reporter: function(results, done) {
   *    // do something with the results
   *    done(results);
   *  }
   */
  reporter?(results: unknown, done: (...args: unknown[]) => void): void;

  /**
   * External before hook is ran at the beginning of the tests run, before creating the Selenium session
   *
   * @example
   * before(done) {
   *   done();
   * }
   */
  before?(done: (err?: unknown) => void): void;

  /**
   * External after hook is ran at the very end of the tests run, after closing the Selenium session
   *
   * @example
   * after(done) {
   *   done();
   * }
   */
  after?(done: (err?: unknown) => void): void;

  /**
   * This will be run before each test suite is started
   *
   * @example
   * beforeEach(browser, done) {
   *   done();
   * }
   */
  beforeEach?(
    browser: NightwatchAPI,
    done: (err?: unknown) => void
  ): void;

  /**
   * This will be run after each test suite is finished
   *
   * @example
   * afterEach(browser, done) {
   *   done();
   * }
   */
  afterEach?(
    browser: NightwatchAPI,
    done: (err?: unknown) => void
  ): void;

  /**
   * Called right after the command .navigateTo() is finished
   *
   * @example
   * async onBrowserNavigate(browser) {
   *   return Promise.resolve();
   * }
   */
  onBrowserNavigate?(browser: NightwatchAPI): Promise<void>;

  /**
   * Called right before the command .quit() is finished
   *
   * @example
   * async onBrowserQuit(browser) {
   *   return Promise.resolve();
   * }
   */
  onBrowserQuit?(browser: NightwatchAPI): Promise<void>;
}
