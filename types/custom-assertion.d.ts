import {NightwatchAPI, NightwatchClientObject} from './index';

interface NightwatchAssertionSuccessfulResult<T> {
  value?: T;
}

interface NightwatchAssertionFailedResult<T> {
  value: T;
  status: number;
}

/**
 * @example
 * import {ScopedSelector, NightwatchAssertion} from 'nightwatch';
 *
 * export const assertion = function ElementHasCount(this: NightwatchAssertion<number>, selector: ScopedSelector, count: number) {
 *   this.message = `Testing if element <${selector}> has count: ${count}`;   
 *
 *   this.expected = count;
 *
 *   this.value = (result) => {
 *     return result.value;
 *   }
 *
 *   this.evaluate = (value) => {
 *     return value === count;
 *   }
 *
 *   this.command = async (callback) => {
 *     const elementsCount = await this.api.element.findAll(selector).count();
 *     callback({value: elementsCount});
 *   }
 * }
 *
 * @see https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-assertions.html
 */
export interface NightwatchAssertion<T> {
  /**
   * If the custom commands operates with DOM elements, this options should be set
   */
  options?: {
    elementSelector: boolean;
  };

  /**
   * Returns the expected value of the assertion which is displayed in the case of a failure
   *
   * @internal
   *
   * @example
   * this.expected = function() {
   *   return this.negate ? `is not '${expectedText}'` : `is '${expectedText}'`;
   * };
   *
   */
  expected: (() => T) | T;

  /**
   * The message which will be used in the test output ana inside the XML reports
   *
   * @remarks The formatMessage method creates the same option message. this.message or this.formatMessage must be specified!
   *
   * @internal
   *
   * @example
   * this.message = `Testing if the page title contains ${expression}`;
   */
  message?: string;

  /**
   * The method which performs the actual assertion.
   * It is called with the result of the value method as the argument.
   *
   * This option can also override the evaluate method. this.pass or this.evaluate must be specified.
   */
  pass?(value: T): unknown;

  /**
   * Called with the result object of the command to retrieve the value which is to be evaluated
   */
  value?(result: NightwatchAssertionSuccessfulResult<T>): T;

  /**
   * The command which is to be executed by the assertion runner; Nightwatch api is available as this.api
   */
  command(
    this: Pick<NightwatchAssertion<T>, 'client' | 'api' | 'negate'>,
    callback: (result: NightwatchAssertionSuccessfulResult<T>) => void
  ): unknown;

  /**
   * Returns the message format which will be used to output the message in the console and also
   * the arguments which will be used for replace the placeholders, used in the order of appearance.
   *
   * The message format also takes into account whether the .not negate has been used.
   *
   * The formatMessage method creates option message. this.message or this.formatMessage must be specified.
   *
   * @internal
   *
   * @example
   * this.formatMessage = function() {
   *   // Use this.negate to determine if ".not" is in use
   *   // Example:
   *   const message = `Testing if the page title ${this.negate ? 'doesn\'t equal %s' : 'equals %s'}`;
   *
   *   return {
   *     message,
   *     args: [`'${expected}'`]
   *   }
   * };
   */
  formatMessage?(): { message: string; args: unknown[] };

  /**
   * Given the value, the condition used to evaluate if the assertion is passed
   *
   * @remarks This option can also override the pass method. this.pass or this.evaluate must be specified!   *
   */
  evaluate?(value: T): boolean;

  /**
   * When defined, this method is called by the assertion runner with the command result, to determine if the
   * value can be retrieved successfully from the result object
   */
  failure?(result: NightwatchAssertionFailedResult<T>): boolean;

  /**
   * When defined, this method is called by the assertion runner with the command result to determine the actual
   * state of the assertion in the event of a failure
   */
  actual?(passed: boolean): string;

  /**
   * Nightwatch API
   */
  readonly api: NightwatchAPI;

  /**
   * Nightwatch Client
   */
  readonly client: NightwatchClientObject;

  /**
   * Use this.negate to determine if ".not" is in use
   */
  readonly negate: boolean;
}

/**
 * @see https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-assertions.html
 */
export interface NightwatchCustomAssertions<ReturnType> {}
