const {roles, roleElements} = require('aria-query');
const {until, WebElement, WebElementPromise} = require('selenium-webdriver');

const {Logger} = require('../../utils/');
const { ScopedValue } = require('./scoped-value.js');
const { ScopedElements } = require('./scoped-elements.js');
const { ScopedElementLocator } = require('./scoped-element-locator.js');
const {
  ScopedElementAssertions
} = require('../assertion/scoped-element-assertions.js');

class ScopedWebElement {
  static root(nightwatchInstance) {
    return new ScopedWebElement('html', null, nightwatchInstance);
  }

  static active(nightwatchInstance) {
    const actions = nightwatchInstance.transportActions;
    const node = nightwatchInstance.queue.add(function findActiveElement() {
      return actions.getActiveElement();
    });
    const instance = new WebElement(nightwatchInstance.transport.driver, node.deferred.promise);

    return new ScopedWebElement(instance, null, nightwatchInstance);
  }

  constructor(selector, parentScopedElement, nightwatchInstance) {
    this.nightwatchInstance = nightwatchInstance;
    this.parentScopedElement = parentScopedElement;

    this.webElement = new WebElementPromise(nightwatchInstance.transport.driver, new Promise(async (resolve, reject) => {
      if (selector instanceof Promise) {
        try {
          selector = await selector;
        } catch (error) {
          return reject(error);
        }
      }

      const {index, timeout, condition, retryInterval, abortOnFailure, suppressNotFoundErrors} = new ScopedElementLocator(selector, nightwatchInstance);

      if (condition instanceof WebElement || condition instanceof WebElementPromise) {
        resolve(condition);
      } else {
        try {
          const webElements = parentScopedElement
            ? await parentScopedElement.webElement.findElements(condition)
            : await nightwatchInstance.transport.driver.wait(until.elementsLocated(condition), timeout, null, retryInterval);

          if (webElements.length === 0) {
            throw new Error(`The element with a "${condition}" selector is not found.`);
          }

          resolve(webElements[index]);
        } catch (error) {
          if (suppressNotFoundErrors) {
            return resolve(null);
          }

          const narrowedError = error.name === 'TimeoutError'
              ? new Error(`Timed out while waiting for element "${condition}" to be present for ${timeout} milliseconds.`)
              : error;

          Logger.error(narrowedError);

          if (abortOnFailure) {
            nightwatchInstance.reporter.registerTestError(narrowedError);

            reject(narrowedError);
          } else {
            resolve(null);
          }
        }
      }
    }));
  }

  get assert() {
    return new ScopedElementAssertions(this, {
      negated: false,
      nightwatchInstance: this.nightwatchInstance
    });
  }

  /**
   * Keeps in sync operation sequence produced by methods.
   */
  #waitFor(promise) {
    this.webElement = new WebElementPromise(this.nightwatchInstance.transport.driver, this.then(async (element) => {
      await promise;

      return element;
    }));

    return this;
  }

  #queueAction(createAction) {
    return this.nightwatchInstance.queue.add(createAction(this.nightwatchInstance.transportActions, this.webElement));
  }

  then(onFulfilled, onRejected) {
    return this.webElement.then(onFulfilled, onRejected);
  }

  find(selector) {
    return new ScopedWebElement(selector, this, this.nightwatchInstance);
  }

  get(selector) {
    return this.find(selector);
  }

  findByText(text, {exact = true, ...options} = {}) {
    const selector = exact
      ? By.xpath(`//*[text()="${text}"]`)
      : By.xpath(`//*[contains(text(),"${text}")]`);

    return this.find({
      ...options,
      selector
    });
  }

  getByText(text, options) {
    return this.findByText(text, options);
  }

  findByRole(role, options) {
    return new ScopedElement(
      new Promise(async (resolve, reject) => {
        try {
          const elements = await this.findAllByRole(role, options);

          const element = elements[0];

          if (!element) {
            throw new Error(`The element with "${role}" role is not found.`);
          }

          resolve(element);
        } catch (error) {
          reject(error);
        }
      }),
      this,
      this.nightwatchInstance
    );
  }

  getByRole(role, options) {
    return this.findByRole(role, options);
  }

  findByPlaceholderText(text, { exact = true, ...options } = {}) {
    const comparingModifier = exact ? '' : '*';

    return this.find({
      ...options,
      selector: By.css(`[placeholder${comparingModifier}="${text}"]`)
    });
  }

  getByPlaceholderText(text, options) {
    return this.findByPlaceholderText(text, options);
  }

  findByLabelText(text, { exact = true, ...options } = {}) {
    const findByForId = async (text, { exact, ...options }) => {
      const selector = exact
        ? By.xpath(`//label[text()="${text}"]`)
        : By.xpath(`//label[contains(text(),"${text}")]`);

      const labelWebElement = await this.find({
        ...options,
        selector,
        suppressNotFoundErrors: true
      });

      if (!labelWebElement) {
        return null;
      }

      const forAttribute = await labelWebElement.getAttribute('for');

      if (!forAttribute) {
        return null;
      }

      return this.find({
        ...options,
        selector: By.css(`input[id="${forAttribute}"]`),
        suppressNotFoundErrors: true
      });
    };

    const findByAriaLabelled = async (text, { exact, ...options }) => {
      const selector = exact
        ? By.xpath(`//label[text()="${text}"]`)
        : By.xpath(`//label[contains(text(),"${text}")]`);

      const labelWebElement = await this.find({
        ...options,
        selector,
        suppressNotFoundErrors: true
      });

      if (!labelWebElement) {
        return null;
      }

      const idAttribute = await labelWebElement.getAttribute('id');

      if (!idAttribute) {
        return null;
      }

      return this.find({
        ...options,
        selector: By.css(`input[aria-labelledby="${idAttribute}"]`),
        suppressNotFoundErrors: true
      });
    };

    const findByDirectNesting = async (text, { exact, ...options }) => {
      const selector = exact
        ? By.xpath(`//label[text()="${text}"]`)
        : By.xpath(`//label[contains(text(),"${text}")]`);

      const labelElement = this.find({
        ...options,
        selector,
        suppressNotFoundErrors: true
      });

      if (!(await labelElement)) {
        return null;
      }

      return labelElement.find({
        ...options,
        selector: By.css('input'),
        suppressNotFoundErrors: true
      });
    };

    const findByDeepNesting = async (text, { exact, ...options }) => {
      const selector = exact
        ? By.xpath(`//label[*[text() = "${text}"]]`)
        : By.xpath(`//label[*[contains(text(), "${text}")]]`);

      const labelElement = this.find({
        ...options,
        selector,
        suppressNotFoundErrors: true
      });

      if (!(await labelElement)) {
        return null;
      }

      return labelElement.find({
        ...options,
        selector: By.css('input'),
        suppressNotFoundErrors: true
      });
    };

    return new ScopedElement(
      new Promise(async (resolve, reject) => {
        let element;

        try {
          element = await findByForId(text, { exact, ...options });
        } catch {}

        if (!element) {
          try {
            element = await findByAriaLabelled(text, { exact, ...options });
          } catch {}
        }

        if (!element) {
          try {
            element = await findByDirectNesting(text, { exact, ...options });
          } catch {}
        }

        if (!element) {
          try {
            element = await findByDeepNesting(text, { exact, ...options });
          } catch {}
        }

        if (!element) {
          try {
            element = await this.find({
              ...options,
              selector: By.css(
                `input[aria-label${exact ? '' : '*'}="${text}"]`
              ),
              suppressNotFoundErrors: true
            });
          } catch {}
        }

        if (!element) {
          reject(
            new Error(
              `The element associated with label whose text ${
                exact ? 'equals' : 'contains'
              } "${text}" has not been found.`
            )
          );
        } else {
          resolve(element);
        }
      }),
      this,
      this.nightwatchInstance
    );
  }

  getByLabelText(text, options) {
    return this.findByLabelText(text, options);
  }

  findByAltText(text, { exact = true, ...options } = {}) {
    const comparingModifier = exact ? '' : '*';

    return this.find({
      ...options,
      selector: By.css(`[alt${comparingModifier}="${text}"]`)
    });
  }

  getByAltText(text, options) {
    return this.findByAltText(text, options);
  }

  findAll(selector) {
    return new ScopedElements(selector, this, this.nightwatchInstance);
  }

  getAll(selector) {
    return this.findAll(selector);
  }

  findAllByText(text, { exact = true, ...options } = {}) {
    const selector = exact
      ? By.xpath(`//*[text()="${text}"]`)
      : By.xpath(`//*[contains(text(),"${text}")]`);

    return this.findAll({
      ...options,
      selector
    });
  }

  getAllByText(text, options) {
    return this.findAllByText(text, options);
  }

  findAllByRole(
    role,
    { selected, checked, pressed, current, level, expanded, ...options } = {}
  ) {
    const roleInformation = roles.get(role);

    if (!roleInformation) {
      throw new Error(`You passed an unknown role "${role}".`);
    }

    if (selected !== undefined) {
      // guard against unknown roles
      if (roleInformation.props['aria-selected'] === undefined) {
        throw new Error(`"aria-selected" is not supported on role "${role}".`);
      }
    }

    if (checked !== undefined) {
      // guard against unknown roles
      if (roleInformation.props['aria-checked'] === undefined) {
        throw new Error(`"aria-checked" is not supported on role "${role}".`);
      }
    }

    if (pressed !== undefined) {
      // guard against unknown roles
      if (roleInformation.props['aria-pressed'] === undefined) {
        throw new Error(`"aria-pressed" is not supported on role "${role}".`);
      }
    }

    if (current !== undefined) {
      // guard against unknown roles
      // All currently released ARIA versions support `aria-current` on all roles.
      // Leaving this for symmetry and forward compatibility
      if (roleInformation.props['aria-current'] === undefined) {
        throw new Error(`"aria-current" is not supported on role "${role}".`);
      }
    }

    if (level !== undefined) {
      // guard against using `level` option with any role other than `heading`
      if (role !== 'heading') {
        throw new Error(`Role "${role}" cannot have "level" property.`);
      }
    }

    if (expanded !== undefined) {
      // guard against unknown roles
      if (roleInformation.props['aria-expanded'] === undefined) {
        throw new Error(`"aria-expanded" is not supported on role "${role}".`);
      }
    }

    const explicitRoleSelector = `*[role~="${role}"]`;

    const roleRelations = roleElements.get(role) || new Set();
    const implicitRoleSelectors = new Set(
      Array.from(roleRelations).map(({ name }) => name)
    );

    const selector = By.css(
      [explicitRoleSelector].concat(Array.from(implicitRoleSelectors)).join(',')
    );

    return this.findAll({
      ...options,
      selector
    });
  }

  getAllByRole(role, options) {
    return this.findAllByRole(role, options);
  }

  findAllByPlaceholderText(text, { exact = true, ...options } = {}) {
    const comparingModifier = exact ? '' : '*';

    return this.findAll({
      ...options,
      selector: By.css(`[placeholder${comparingModifier}="${text}"]`)
    });
  }

  getAllByPlaceholderText(text, options) {
    return this.findAllByPlaceholderText(text, options);
  }

  findAllByAltText(text, { exact = true, ...options } = {}) {
    const comparingModifier = exact ? '' : '*';

    return this.findAll({
      ...options,
      selector: By.css(`[alt${comparingModifier}="${text}"]`)
    });
  }

  getAllByAltText(text, options) {
    return this.findAllByAltText(text, options);
  }

  getFirstElementChild() {
    const node = this.#queueAction(
      (actions, webElement) =>
        function getFirstElementChild() {
          return actions.getFirstElementChild(webElement);
        }
    );

    return new ScopedElement(
      node.deferred.promise,
      this,
      this.nightwatchInstance
    );
  }

  getLastElementChild() {
    const node = this.#queueAction(
      (actions, webElement) =>
        function getLastElementChild() {
          return actions.getLastElementChild(webElement);
        }
    );

    return new ScopedElement(
      node.deferred.promise,
      this,
      this.nightwatchInstance
    );
  }

  getNextElementSibling() {
    const node = this.#queueAction(
      (actions, webElement) =>
        function getNextElementSibling() {
          return actions.getNextSibling(webElement);
        }
    );

    return new ScopedElement(
      node.deferred.promise,
      this.parentScopedElement,
      this.nightwatchInstance
    );
  }

  getPreviousElementSibling() {
    const node = this.#queueAction(
      (actions, webElement) =>
        function getPreviousElementSibling() {
          return actions.getPreviousSibling(webElement);
        }
    );

    return new ScopedElement(
      node.deferred.promise,
      this.parentScopedElement,
      this.nightwatchInstance
    );
  }

  getShadowRoot() {
    const node = this.#queueAction(
      (actions, webElement) =>
        function getShadowRoot() {
          return actions.getShadowRoot(webElement);
        }
    );

    return new ScopedElement(
      node.deferred.promise,
      this,
      this.nightwatchInstance
    );
  }

  getId() {
    return new ScopedValue(this.webElement.getId(), this.nightwatchInstance);
  }

  getRect() {
    const node = this.#queueAction(
      (actions, webElement) =>
        function getRect() {
          return actions.getElementRect(webElement);
        }
    );

    return new ScopedValue(node.deferred.promise, this.nightwatchInstance);
  }

  getTagName() {
    const node = this.#queueAction(
      (actions, webElement) =>
        function getTagName() {
          return actions.getElementTagName(webElement);
        }
    );

    return new ScopedValue(node.deferred.promise, this.nightwatchInstance);
  }

  getText() {
    const node = this.#queueAction(
      (actions, webElement) =>
        function getText() {
          return actions.getElementText(webElement);
        }
    );

    return new ScopedValue(node.deferred.promise, this.nightwatchInstance);
  }

  click() {
    const node = this.#queueAction(
      (actions, webElement) =>
        function click() {
          return actions.clickElement(webElement);
        }
    );

    return this.#waitFor(node.deferred.promise);
  }

  clear() {
    const node = this.#queueAction(
      (actions, webElement) =>
        function clear() {
          return actions.clearElementValue(webElement);
        }
    );

    return this.#waitFor(node.deferred.promise);
  }

  sendKeys(...keys) {
    const node = this.#queueAction(
      (actions, webElement) =>
        function sendKeys() {
          return actions.sendKeysToElement(webElement, keys);
        }
    );

    return this.#waitFor(node.deferred.promise);
  }

  submit() {
    const node = this.#queueAction(
      (actions, webElement) =>
        function submit() {
          return actions.elementSubmit(webElement);
        }
    );

    return this.#waitFor(node.deferred.promise);
  }

  getProperty(name) {
    const node = this.#queueAction(
      (actions, webElement) =>
        function getProperty() {
          return actions.getElementProperty(webElement, name);
        }
    );

    return new ScopedValue(node.deferred.promise, this.nightwatchInstance);
  }

  setProperty(name, value) {
    const node = this.#queueAction(
      (actions, webElement) =>
        function setProperty() {
          return actions.setElementProperty(webElement, name, value);
        }
    );

    return this.#waitFor(node.deferred.promise);
  }

  getAttribute(name) {
    const node = this.#queueAction(
      (actions, webElement) =>
        function getAttribute() {
          return actions.getElementValue(webElement, name);
        }
    );

    return new ScopedValue(node.deferred.promise, this.nightwatchInstance);
  }

  setAttribute(name, value) {
    const node = this.#queueAction(
      (actions, webElement) =>
        function setAttribute() {
          return actions.setElementAttribute(webElement, name, value);
        }
    );

    return this.#waitFor(node.deferred.promise);
  }

  takeScreenshot(shouldBeInView) {
    const node = this.#queueAction(
      (actions, webElement) =>
        function takeScreenshot() {
          return actions.takeElementScreenshot(webElement, shouldBeInView);
        }
    );

    return node.deferred.promise;
  }

  dragAndDrop(destination) {
    const node = this.#queueAction(
      (actions, webElement) =>
        function dragAndDrop() {
          return actions.dragElement(webElement, destination);
        }
    );

    return this.#waitFor(node.deferred.promise);
  }

  moveTo(x = 0, y = 0) {
    const node = this.#queueAction(
      (actions, webElement) =>
        function moveTo() {
          return actions.moveTo(webElement, x, y);
        }
    );

    return this.#waitFor(node.deferred.promise);
  }

  update(...keys) {
    const node = this.#queueAction(
      (actions, webElement) =>
        function update() {
          return actions.setElementValue(webElement, keys);
        }
    );

    return this.#waitFor(node.deferred.promise);
  }

  upload(file) {
    const node = this.#queueAction(
      (actions, webElement) =>
        function upload() {
          return actions.uploadFile(webElement, file);
        }
    );

    return this.#waitFor(node.deferred.promise);
  }

  getAccessibleName() {
    const node = this.#queueAction(
      (actions, webElement) =>
        function getAccessibleName() {
          return actions.getElementAccessibleName(webElement);
        }
    );

    return new ScopedValue(node.deferred.promise, this.nightwatchInstance);
  }

  getAriaRole() {
    const node = this.#queueAction(
      (actions, webElement) =>
        function getAriaRole() {
          return actions.getElementAriaRole(webElement);
        }
    );

    return new ScopedValue(node.deferred.promise, this.nightwatchInstance);
  }

  getCssProperty(name) {
    const node = this.#queueAction(
      (actions, webElement) =>
        function getCssProperty() {
          return actions.getElementCSSValue(webElement, name);
        }
    );

    return new ScopedValue(node.deferred.promise, this.nightwatchInstance);
  }

  getSize() {
    return this.getRect();
  }

  getValue() {
    return this.getProperty('value');
  }

  clickAndHold() {
    const node = this.#queueAction(
      (actions, webElement) =>
        function clickAndHold() {
          return actions.pressAndHold(webElement);
        }
    );

    return this.#waitFor(node.deferred.promise);
  }

  doubleClick() {
    const node = this.#queueAction(
      (actions, webElement) =>
        function doubleClick() {
          return actions.doubleClick(webElement);
        }
    );

    return this.#waitFor(node.deferred.promise);
  }

  rightClick() {
    const node = this.#queueAction(
      (actions, webElement) =>
        function rightClick() {
          return actions.contextClick(webElement);
        }
    );

    return this.#waitFor(node.deferred.promise);
  }

  getLocation() {
    return this.getRect();
  }

  axeRun(options) {
    return this.#waitFor(
      this.nightwatchInstance.api.axeRun(this.webElement, options)
    );
  }
}

exports.ScopedElement = ScopedElement;
