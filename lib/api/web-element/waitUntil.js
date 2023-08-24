const {until, Condition} = require('selenium-webdriver');
const {AssertionRunner} = require('../../assertion');
const {isDefined, format} = require('../../utils');
const {ScopedElementLocator} = require('./element-locator');
const {NoSuchElementError} = require('../../element/locator');

const mapToSeleniumFunction = {
  'selected': until.elementIsSelected,
  'not.selected': until.elementIsNotSelected,
  'visible': until.elementIsVisible,
  'not.visible': until.elementIsNotVisible,
  'enabled': until.elementIsEnabled,
  'not.enabled': until.elementIsDisabled,
  'disabled': until.elementIsDisabled,
  'present': (webElement, scopedElementLocator) => until.elementLocated(scopedElementLocator.condition),
  'not.present': (webElement, scopedElementLocator) => new Condition('until elmenet is not present', (driver) => driver.findElements(scopedElementLocator.condition).then(elements => elements.length ? false : true))
};

class WaitUntil {
  constructor(scopedElement, {action, timeout, retryInterval, message, nightwatchInstance, selector, abortOnFailure}) {
    this.scopedElement = scopedElement;
    this.conditionFn = mapToSeleniumFunction[action];
    this.nightwatchInstance = nightwatchInstance;
    this.action = action;
    this.message = message;
    this.selector = selector;
    this.timeout = timeout || this.nightwatchInstance.settings.globals.waitForConditionTimeout;
    this.retryInterval = retryInterval || this.nightwatchInstance.settings.globals.waitForConditionPollInterval;
    this.abortOnFailure = isDefined(abortOnFailure) ? abortOnFailure : this.nightwatchInstance.settings.globals.abortOnAssertionFailure;
    this.scopedElementLocator = ScopedElementLocator.create(selector, nightwatchInstance);
  }

  createNode() {
    const createAction = (actions, webElementPromise) =>  async function() {

      let result;
      try {

        if (!this.conditionFn) {
          throw new Error(`Invalid action ${this.action} for element.waitUntil command. Possible actions: ${Object.keys(mapToSeleniumFunction).toString()}`);
        }

        const webElement = await webElementPromise;

        //TODO: handle for present and not.present action.
        if (!webElement && !['present', 'not.present'].includes(this.action)) {
          throw new NoSuchElementError({element: this.scopedElementLocator, abortOnFailure: this.abortOnFailure});
        }

        const elapsedTime = new Date().getTime() - node.startTime;
        const commandResult = await this.scopedElement.driver.wait(this.conditionFn(webElementPromise, this.scopedElementLocator), this.timeout, this.message, this.retryInterval, ()=>{});
        result = await this.pass(commandResult, elapsedTime).catch(err => err);

        return result;
      } catch (err) {
        const elapsedTime = new Date().getTime() - node.startTime;
        const actual = err instanceof NoSuchElementError ? 'not present' : null;
        result = await this.fail(err, actual, elapsedTime).catch(err => err);

        return result;
      } finally {
        node.deferred.resolve(result);
      }
    }.bind(this);
    const node = this.scopedElement.queueAction({name: 'waitUntil', createAction});

    return node;
  }


  async wait() {
    const assertApi = this.nightwatchInstance.api.assert;

    try {
      const node =  this.createNode();

      return this.scopedElement.waitFor(node.deferred.promise);
    } catch (err) {
      assertApi.ok(false, err.message);
    }
  }

  formatMsg(message, timeMs) {
    const defaultMsg = this.message || message;

    return format(defaultMsg, this.selector, timeMs);
  }

  assert({result, passed, err, message, elapsedTime}) {
    const {reporter} = this.scopedElement;

    const runner = new AssertionRunner({abortOnFailure: this.abortOnFailure, passed, err, message, reporter, elapsedTime});

    return runner.run(result);
  }

  pass(result, elapsedTime) {
    const sliceAction = this.action.split('.');
    const expected = sliceAction[0] === 'not' ? `not ${sliceAction[1]}` : this.action;
    const message = this.formatMsg(`Element <%s> was ${expected} in %d milliseconds`, elapsedTime);

    return this.assert({
      result,
      passed: true,
      err: {
        expected
      },
      elapsedTime,
      message
    });
  }

  fail(result, actual, elapsedTime) {
    const sliceAction = this.action.split('.');

    actual = actual ? actual : sliceAction[0] === 'not' ? sliceAction[1] : `not ${this.action}`;
    const expected = sliceAction[0] === 'not' ? `not ${sliceAction[1]}` : this.action;
    const message = this.formatMsg(`Timed out while waiting for element <%s> to be ${expected} for %d milliseconds`, this.timeout);

    return this.assert({
      result,
      passed: false,
      message,
      err: {
        actual,
        expected
      },
      elapsedTime
    });
  }
}

module.exports = WaitUntil;
