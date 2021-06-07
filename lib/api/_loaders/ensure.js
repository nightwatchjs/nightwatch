const util = require('util');
const {until, WebElement} = require('selenium-webdriver');
const EventEmitter = require('events');

const Utils = require('../../utils');
const {Logger} = Utils;
const {AssertionRunner} = require('../../assertion');
const SeleniumTransport = require('../../transport/selenium-webdriver');
const BaseLoader = require('./_base-loader.js');

class SeleniumCommand extends EventEmitter {
  constructor({negate, args, commandName}) {
    super();

    this.negate = negate;
    this.commandName = commandName;
    this.defaultTimeout = 1000;
    this.args = args;
    this.actual = null;
    this.message = '';
    this.setExpected();
  }

  setExpected() {
    let operator = this.getVerb();
    this.expected = `${operator} '${this.args[0]}'`;
  }

  isElementCommand() {
    return EnsureAssertion.elementCommands.includes(this.commandName);
  }

  requiresLocatingElement() {
    return EnsureAssertion.requiresLocating.includes(this.commandName);
  }

  getVerb() {
    let message = EnsureAssertion.assertOperators[this.commandName];
    let actionVerb;
    let operator;

    if (Utils.isString(message)) {
      actionVerb = EnsureAssertion.defaultVerb;
    } else if (Array.isArray(message) && message[1]) {
      actionVerb = message[1];
    }

    operator = this.negate ? actionVerb[1] : actionVerb[0];

    return operator;
  }

  getMessage(passed) {
    let message = EnsureAssertion.assertOperators[this.commandName];

    if (!message) {
      return '';
    }

    let operator = this.getVerb();
    if (Array.isArray(message)) {
      message = message[0];
    }

    message = this.isElementCommand() ?
      util.format(message, this.args[0], operator) :
      util.format(message, operator, this.args[0]);

    return message;
  }

  isSeleniumElement() {
    return this.args[0] && (this.args[0] instanceof WebElement);
  }

  async adaptElementArgument(transport) {
    if (!this.requiresLocatingElement()) {
      this.args[0] = SeleniumTransport.createLocator(this.args[0]);

      return;
    }

    if (this.isSeleniumElement()) {
      return;
    }

    const locator = SeleniumTransport.createLocator(this.args[0]);
    this.args[0] = await transport.driver.wait(until.elementLocated(locator), this.defaultTimeout);
  }

  async execute(transport) {
    if (this.isElementCommand()) {
      await this.adaptElementArgument(transport);
    }

    return transport.driver.wait(until[this.commandName](...this.args), this.defaultTimeout);
  }
}

class EnsureAssertionLoader extends BaseLoader {
  static get defaultVerb() {
    return ['is', 'is not'];
  }

  static get assertOperators() {
    return {
      ableToSwitchToFrame: 'browser driver %s able to switch to the designated frame',
      alertIsPresent: 'alert %s present',
      titleIs: 'title %s %s',
      titleContains: ['title %s %s', ['contains', 'does not contain']],
      titleMatches: ['title %s %s', ['matches', 'does not match']],
      urlIs: 'url %s %s',
      urlContains: ['url %s %s', ['contains', 'does not contain']],
      urlMatches: ['url %s %s', ['matches', 'does not match']],
      elementLocated: ['element "%s" %s located'],
      elementsLocated: ['elements "%s" %s located', ['are', 'are not']],
      stalenessOf: 'element "%s" %s stale',
      elementIsVisible: 'element "%s" %s visible',
      elementIsNotVisible: 'element "%s" %s not visible',
      elementIsEnabled: 'element "%s" %s enabled',
      elementIsDisabled: 'element "%s" %s disabled',
      elementIsSelected: 'element "%s" %s selected',
      elementIsNotSelected: 'element "%s" %s not selected',
      elementTextIs: 'element "%s" text %s',
      elementTextContains: ['element "%s" text %s', ['contains', 'does not contain']],
      elementTextMatches: ['element "%s" text %s', ['matches', 'does not match']],
    };
  }

  static get elementCommands() {
    return [
      'elementLocated',
      'elementsLocated',
      'stalenessOf',
      'elementIsVisible',
      'elementIsNotVisible',
      'elementIsEnabled',
      'elementIsDisabled',
      'elementIsSelected',
      'elementIsNotSelected',
      'elementTextIs',
      'elementTextContains',
      'elementTextMatches',
    ];
  }

  static get requiresLocating() {
    return [
      'stalenessOf',
      'elementIsVisible',
      'elementIsNotVisible',
      'elementIsEnabled',
      'elementIsDisabled',
      'elementIsSelected',
      'elementIsNotSelected',
      'elementTextIs',
      'elementTextContains',
      'elementTextMatches',
    ];
  }

  /**
   * @param commandName
   * @param abortOnFailure
   * @returns {Function}
   */
  createAssertion(commandName, abortOnFailure) {
    return function assertFn({negate, args}) {
      const {reporter, transport} = this;
      const startTime = new Date();
      const namespace = 'ensure';

      const commandFn = async () => {
        const command = new SeleniumCommand({negate, args, commandName});
        const {stackTrace, expected} = command;
        const message = command.getMessage();
        let passed = !negate;
        let actual = '';

        try {
          await command.execute(transport);
        } catch (err) {
          passed = !!negate;
          const lines = err.message.split('\n');
          Logger.error(err);
          if (lines.length > 1) {
            actual = lines[1];
          } else {
            actual = err.message;
          }

          command.error = err;
        }

        const elapsedTime = new Date() - startTime;
        const runner = new AssertionRunner({
          passed,
          err: {
            expected, actual
          }, message, calleeFn: assertFn, abortOnFailure, stackTrace, reporter, elapsedTime
        });

        return runner.run();
      };

      this.commandQueue.add({
        commandName,
        commandFn,
        context: this.api,
        args: [],
        stackTrace: assertFn.stackTrace,
        namespace
      });

      return this.api;
    }.bind(this);
  }

  /**
   *
   * @param {object} [parent]
   * @return {ApiLoader}
   */
  loadAssertions(parent = null) {
    Object.keys(until).forEach(propertyName => {
      let namespace;
      if (parent) {
        namespace = parent.ensure = parent.ensure || {};
      }

      this.nightwatchInstance.setApiMethod(propertyName, namespace || 'ensure', (function(commandName) {
        return this.createAssertion(commandName, false);
      }.bind(this))(propertyName));
    });

    return this;
  }
}

module.exports = EnsureAssertionLoader;
