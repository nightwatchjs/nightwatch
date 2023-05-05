import {NightwatchCustomAssertions} from './custom-assertion';
import {Awaitable, Definition, JSON_WEB_OBJECT, NightwatchAPI} from './index';

export interface NightwatchAssertionsError {
	name: string;
	message: string;
	showDiff: boolean;
	stack: string;
}

export interface NightwatchCommonAssertions {
	/**
	 * Checks if the given attribute of an element contains the expected value.
	 *
	 * ```
	 *    this.demoTest = function (client) {
	 *      browser.assert.attributeContains('#someElement', 'href', 'google.com');
	 *    };
	 * ```
	 */
	attributeContains(
		selector: Definition,
		attribute: string,
		expected: string,
		message?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Checks if the given attribute of an element has the expected value.
	 *
	 * ```
	 *    this.demoTest = function (client) {
	 *      browser.assert.attributeEquals('body', 'data-attr', 'some value');
	 *    };
	 * ```
	 */
	attributeEquals(
		selector: Definition,
		attribute: string,
		expected: string,
		message?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Check if an element's attribute value matches a regular expression.
	 *
	 * @example
	 *
	 * ```
	 *    this.demoTest = function (browser) {
	 *      browser.assert.attributeMatches('body', 'data-attr', '(value)');
	 *    };
	 * ```
	 *
	 */
	attributeMatches(
		selector: Definition,
		attribute: string,
		regex: string | RegExp,
		msg?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Checks if the specified css property of a given element has the expected value.
	 *
	 * ```
	 *    this.demoTest = function (client) {
	 *      browser.assert.cssProperty('#main', 'display', 'block');
	 *    };
	 * ```
	 */
	cssProperty(
		selector: Definition,
		cssProperty: string,
		expected: string | number,
		msg?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string | number>>;

	/**
	 * Checks if the specified DOM property of a given element has the expected value.
	 * For all the available DOM element properties, consult the [Element doc at MDN](https://developer.mozilla.org/en-US/docs/Web/API/element).
	 * Several properties can be specified (either as an array or command-separated list). Nightwatch will check each one for presence.
	 */
	domPropertyContains(
		selector: Definition,
		domProperty: string,
		expected: string | number,
		msg?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<any>>;

	/**
	 * Checks if the specified DOM property of a given element has the expected value.
	 * For all the available DOM element properties, consult the [Element doc at MDN](https://developer.mozilla.org/en-US/docs/Web/API/element).
	 * If the result value is JSON object or array, a deep equality comparison will be performed.
	 */
	domPropertyEquals(
		selector: Definition,
		domProperty: string,
		expected: string | number,
		msg?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<any>>;

	/**
	 * Check if specified DOM property value of a given element matches a regex.
	 * For all the available DOM element properties, consult the [Element doc at MDN](https://developer.mozilla.org/en-US/docs/Web/API/element).
	 */
	domPropertyMatches(
		selector: Definition,
		domProperty: string,
		expected: string | RegExp,
		msg?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<any>>;

	/**
	 * Checks if the number of elements specified by a selector is equal to a given value.
	 *
	 * @example
	 *
	 * this.demoTest = function (browser) {
	 *   browser.assert.elementsCount('div', 10);
	 *   browser.assert.not.elementsCount('div', 10);
	 * }
	 *
	 */
	elementsCount(
		selector: Definition,
		count: number,
		msg?: string
	): Awaitable<
		NightwatchAPI,
		NightwatchAssertionsResult<JSON_WEB_OBJECT[]> & {
			WebdriverElementId: string;
		}
	>;

	/**
	 * Checks if the given element exists in the DOM.
	 *
	 * ```
	 *    this.demoTest = function (client) {
	 *      browser.assert.elementPresent("#main");
	 *    };
	 * ```
	 */
	elementPresent(
		selector: Definition,
		msg?: string
	): Awaitable<
		NightwatchAPI,
		NightwatchAssertionsResult<Array<Omit<JSON_WEB_OBJECT, 'getId'>>>
	>;

	/**
	 * Checks if the given element does not exists in the DOM.
	 *
	 * @example
	 * ```
	 *    this.demoTest = function (browser) {
	 *      browser.assert.elementNotPresent(".should_not_exist");
	 *    };
	 * ```
	 *
	 * @deprecated In favour of `assert.not.elementPresent()`.
	 */
	elementNotPresent(
		selector: Definition,
		msg?: string
	): Awaitable<
		NightwatchAPI,
		NightwatchAssertionsResult<Array<Omit<JSON_WEB_OBJECT, 'getId'>>>
	>;

	/**
	 * Checks if the given element does not have the specified CSS class.
	 *
	 * ```
	 *    this.demoTest = function (browser) {
	 *      browser.assert.cssClassNotPresent('#main', 'container');
	 *    };
	 * ```
	 *
	 * @deprecated In favour of `assert.not.hasClass()`.
	 */
	cssClassNotPresent(
		selector: Definition,
		className: string,
		msg?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Checks if the given element has the specified CSS class.
	 *
	 * ```
	 *    this.demoTest = function (client) {
	 *      browser.assert.cssClassPresent('#main', 'container');
	 *    };
	 * ```
	 *
	 * @deprecated In favour of `assert.hasClass()`.
	 */
	cssClassPresent(
		selector: Definition,
		className: string,
		message?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Checks if the given element has the specified CSS class.
	 *
	 * @example
	 *
	 *
	 * ```
	 *    this.demoTest = function (browser) {
	 *      browser.assert.hasClass('#main', 'container');
	 *      browser.assert.hasClass('#main', ['visible', 'container']);
	 *      browser.assert.hasClass('#main', 'visible container');
	 *    };
	 * ```
	 *
	 */
	hasClass(
		selector: Definition,
		className: string | string[],
		msg?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Checks if the given element contains the specified DOM attribute.
	 *
	 * Equivalent of: https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute
	 *
	 * @example
	 *
	 * ```
	 *    this.demoTest = function (browser) {
	 *      browser.assert.hasAttribute('#main', 'data-track');
	 *    };
	 * ```
	 *
	 */
	hasAttribute(
		selector: Definition,
		expectedAttribute: string,
		msg?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string[]>>;

	/**
	 * Checks if the given element is enabled (as indicated by the 'disabled' attribute).
	 *
	 * @example
	 *  this.demoTest = function (browser) {
	 *    browser.assert.enabled('.should_be_enabled');
	 *    browser.assert.enabled({selector: '.should_be_enabled'});
	 *    browser.assert.enabled({selector: '.should_be_enabled', suppressNotFoundErrors: true});
	 *  };
	 */
	enabled(
		selector: Definition,
		message?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<boolean>>;

	/**
	 * Checks if the given element is selected.
	 *
	 * @example
	 *  this.demoTest = function (browser) {
	 *    browser.assert.selected('.should_be_selected');
	 *    browser.assert.selected({selector: '.should_be_selected'});
	 *    browser.assert.selected({selector: '.should_be_selected', suppressNotFoundErrors: true});
	 *  };
	 */
	selected(
		selector: Definition,
		message?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<boolean>>;

	/**
	 * Checks if the given element contains the specified text.
	 *
	 * ```
	 *    this.demoTest = function (client) {
	 *      browser.assert.containsText('#main', 'The Night Watch');
	 *    };
	 * ```
	 *
	 * @deprecated In favour of `assert.textContains()`.
	 */
	containsText(
		selector: Definition,
		expectedText: string,
		message?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Checks if the given element contains the specified text.
	 *
	 * @example
	 * ```
	 *   this.demoTest = function (browser) {
	 *     browser.assert.textContains('#main', 'The Night Watch');
	 *   };
	 * ```
	 *
	 */
	textContains(
		selector: Definition,
		expectedText: string,
		msg?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Check if an element's inner text equals the expected text.
	 *
	 * @example
	 *
	 * ```
	 *   this.demoTest = function (browser) {
	 *     browser.assert.textEquals('#main', 'The Night Watch');
	 *   };
	 * ```
	 *
	 */
	textEquals(
		selector: Definition,
		expectedText: string,
		msg?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Check if an elements inner text matches a regular expression.
	 *
	 * @example
	 *
	 * ```
	 *   this.demoTest = function (browser) {
	 *     browser.assert.textMatches('#main', '^Nightwatch');
	 *   };
	 * ```
	 *
	 */
	textMatches(
		selector: Definition,
		regex: string | RegExp,
		msg?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Checks if the page title equals the given value.
	 *
	 * ```
	 *    this.demoTest = function (client) {
	 *      browser.assert.title("Nightwatch.js");
	 *    };
	 * ```
	 *
	 * @deprecated In favour of `titleEquals()`.
	 */
	title(
		expected: string,
		message?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Checks if the page title equals the given value.
	 *
	 * ```
	 *    this.demoTest = function (client) {
	 *      browser.assert.title("Nightwatch.js");
	 *    };
	 * ```
	 */
	titleContains(
		expected: string,
		message?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Checks if the page title equals the given value.
	 * @since 2.0
	 * ```
	 *    this.demoTest = function (client) {
	 *      browser.assert.titleEquals("Nightwatch.js");
	 *    };
	 * ```
	 */
	titleEquals(
		expected: string,
		message?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Checks if the current title matches a regular expression.
	 *
	 * @example
	 *
	 * ```
	 *    this.demoTest = function (client) {
	 *      browser.assert.titleMatches('^Nightwatch');
	 *    };
	 * ```
	 *
	 */
	titleMatches(
		regex: string | RegExp,
		msg?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Checks if the current URL contains the given value.
	 *
	 * ```
	 *    this.demoTest = function (client) {
	 *      browser.assert.urlContains('google');
	 *    };
	 * ```
	 */
	urlContains(
		expectedText: string,
		message?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Checks if the current url equals the given value.
	 *
	 * ```
	 *    this.demoTest = function (client) {
	 *      browser.assert.urlEquals('https://www.google.com');
	 *    };
	 * ```
	 */
	urlEquals(
		expected: string,
		message?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Checks if the current url matches a regular expression.
	 *
	 * @example
	 * ```
	 *    this.demoTest = function (client) {
	 *      browser.assert.urlMatches('^https');
	 *    };
	 * ```
	 *
	 */
	urlMatches(
		regex: string | RegExp,
		msg?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Checks if the given form element's value equals the expected value.
	 *
	 * ```
	 *    this.demoTest = function (client) {
	 *      browser.assert.value("form.login input[type=text]", "username");
	 *    };
	 * ```
	 *
	 * @deprecated In favour of `assert.valueEquals()`.
	 */
	value(
		selector: Definition,
		expectedText: string,
		message?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Checks if the given form element's value contains the expected value.
	 *
	 * ```
	 *    this.demoTest = function (client) {
	 *      browser.assert.valueContains("form.login input[type=text]", "username");
	 *    };
	 * ```
	 */
	valueContains(
		selector: Definition,
		expectedText: string,
		message?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Checks if the given form element's value equals the expected value.
	 *
	 * The existing .assert.value() command.
	 *
	 * @example
	 * ```
	 *    this.demoTest = function (browser) {
	 *      browser.assert.valueEquals("form.login input[type=text]", "username");
	 *    };
	 * ```
	 *
	 */
	valueEquals(
		selector: Definition,
		expected: string,
		msg?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;

	/**
	 * Checks if the given element is not visible on the page.
	 *
	 * @example
	 * ```
	 *    this.demoTest = function (browser) {
	 *      browser.assert.hidden('.should_not_be_visible');
	 *    };
	 * ```
	 *
	 * @deprecated In favour of `assert.not.visible()`.
	 */
	hidden(
		selector: Definition,
		msg?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<boolean>>;

	/**
	 * Checks if the given element is visible on the page.
	 *
	 * ```
	 *    this.demoTest = function (client) {
	 *      browser.assert.visible(".should_be_visible");
	 *    };
	 * ```
	 */
	visible(
		selector: Definition,
		message?: string
	): Awaitable<NightwatchAPI, NightwatchAssertionsResult<boolean>>;

	NightwatchAssertionsError: NightwatchAssertionsError;
}

export interface NightwatchNodeAssertionsResult {
	value: null;
	returned: 1;
}

export interface NightwatchNodeAssertions {
	// The following definitions are taken from @types/assert

	fail(
		message?: string | Error
	): Awaitable<NightwatchAPI, NightwatchNodeAssertionsResult | Error>;
	fail(
		actual: any,
		expected: any,
		message?: string | Error,
		operator?: string
	): Awaitable<NightwatchAPI, NightwatchNodeAssertionsResult | Error>;

	ok(
		value: any,
		message?: string | Error
	): Awaitable<NightwatchAPI, NightwatchNodeAssertionsResult | Error>;

	equal(
		actual: any,
		expected: any,
		message?: string | Error
	): Awaitable<NightwatchAPI, NightwatchNodeAssertionsResult | Error>;
	notEqual(
		actual: any,
		expected: any,
		message?: string | Error
	): Awaitable<NightwatchAPI, NightwatchNodeAssertionsResult | Error>;

	deepEqual(
		actual: any,
		expected: any,
		message?: string | Error
	): Awaitable<NightwatchAPI, NightwatchNodeAssertionsResult | Error>;
	notDeepEqual(
		actual: any,
		expected: any,
		message?: string | Error
	): Awaitable<NightwatchAPI, NightwatchNodeAssertionsResult | Error>;

	strictEqual(
		actual: any,
		expected: any,
		message?: string | Error
	): Awaitable<NightwatchAPI, NightwatchNodeAssertionsResult | Error>;
	notStrictEqual(
		actual: any,
		expected: any,
		message?: string | Error
	): Awaitable<NightwatchAPI, NightwatchNodeAssertionsResult | Error>;

	deepStrictEqual(
		actual: any,
		expected: any,
		message?: string | Error
	): Awaitable<NightwatchAPI, NightwatchNodeAssertionsResult | Error>;
	notDeepStrictEqual(
		actual: any,
		expected: any,
		message?: string | Error
	): Awaitable<NightwatchAPI, NightwatchNodeAssertionsResult | Error>;

	throws(
		block: () => any,
		message?: string | Error
	): Awaitable<NightwatchAPI, NightwatchNodeAssertionsResult | Error>;
	doesNotThrow(
		block: () => any,
		message?: string | Error
	): Awaitable<NightwatchAPI, NightwatchNodeAssertionsResult | Error>;

	ifError(
		value: any
	): Awaitable<NightwatchAPI, NightwatchNodeAssertionsResult | Error>;

	rejects(
		block: (() => Promise<any>) | Promise<any>,
		message?: string | Error
	): Awaitable<NightwatchAPI, NightwatchNodeAssertionsResult | Error>;
	doesNotReject(
		block: (() => Promise<any>) | Promise<any>,
		message?: string | Error
	): Awaitable<NightwatchAPI, NightwatchNodeAssertionsResult | Error>;

	match(
		value: string,
		regExp: RegExp,
		message?: string | Error
	): Awaitable<NightwatchAPI, NightwatchNodeAssertionsResult | Error>;
	doesNotMatch(
		value: string,
		regExp: RegExp,
		message?: string | Error
	): Awaitable<NightwatchAPI, NightwatchNodeAssertionsResult | Error>;
}

export interface NightwatchAssertions
	extends NightwatchCommonAssertions,
	NightwatchCustomAssertions {
	/**
	 * Negates any of assertions following in the chain.
	 */
	not: Omit<NightwatchAssertions, 'not'>;
}

export interface NightwatchAssertionsResult<T> {
	value: T;
	status: 0;
	returned: 1;
	passed: true;
}

export interface Assert extends NightwatchAssertions, NightwatchNodeAssertions { }

/**
 * Performs an assertion
 *
 */
export type NightwatchAssert = (
	passed: boolean,
	receivedValue?: any,
	expectedValue?: any,
	message?: string,
	abortOnFailure?: boolean,
	originalStackTrace?: string
) => void;
