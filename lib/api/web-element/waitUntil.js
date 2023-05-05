const until = require('selenium-webdriver/lib/until');
const {AssertionRunner} = require('../../assertion');
const Utils = require('../../utils');

const mapToSeleniumFunction = {
  'selected': until.elementIsSelected,
  'not.selected': until.elementIsNotSelected,
  'visible': until.elementIsVisible,
  'not.visible': until.elementIsNotVisible,
  'enabled': until.elementIsEnabled,
  'not.enabled': until.elementIsDisabled,
  'disabled': until.elementIsDisabled
};



class WaitUntil {
  constructor(scopedElement, {action, timeout, retryInterval, message, nightwatchInstance, selector}) {
    this.scopedElement = scopedElement;
    this.conditionFn = mapToSeleniumFunction[action];
    this.nightwatchInstance = nightwatchInstance;
    this.action = action;
    this.message = message;
    this.selector = selector;
    this.timeout = timeout || this.nightwatchInstance.settings.globals.waitForConditionTimeout;
    this.retryInterval = retryInterval || this.nightwatchInstance.settings.globals.waitForConditionPollInterval;
 
  }

  createNode() {
    const createAction = (actions, webElement) =>  function() {
      if (!this.conditionFn) {
        throw new Error(`Invalid action ${this.action} for WaitUntil Command. Possible actions: ${Object.keys(mapToSeleniumFunction).toString()}`);
      }

      return actions['wait'](this.conditionFn(webElement), this.timeout, this.retryInterval, this.message, ()=>{})
        .then(result => {
          const elapsedTime = new Date().getTime() - node.startTime;
          if (result.error) {
            const actual = result.error.name === 'NightwatchElementError' ? 'not found' : null;

            return this.fail(result, actual, elapsedTime);
          }

          return this.pass(result, elapsedTime);
        })
        .then(result => node.deferred.resolve(result))
        .catch(err=> node.deferred.resolve(err));
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
    
    return Utils.format(defaultMsg, this.selector, timeMs);
  }

  assert({result, passed, err, message, elapsedTime}) {
    const {reporter} = this.scopedElement;
    
    const runner = new AssertionRunner({abortOnFailure: true, passed, err, message, reporter, elapsedTime});

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