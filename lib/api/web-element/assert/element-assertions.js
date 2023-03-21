const {ScopedValue} = require('../element-value.js');

class ElementAssertions {
  constructor(scopedElement, {negated, nightwatchInstance}) {
    this.negated = negated;
    this.scopedElement = scopedElement;
    this.nightwatchInstance = nightwatchInstance;
  }

  #assert(callback) {
    const assert = this.nightwatchInstance.api.assert;

    callback(this.negated ? assert.not : assert, this.scopedElement.webElement);

    return this.scopedElement;
  }

  get not() {
    return new ElementAssertions(this.scopedElement, {
      negated: true,
      nightwatchInstance: this.nightwatchInstance
    });
  }

  enabled(message) {
    return this.#assert((assertApi, element) =>
      assertApi.enabled(element, message)
    );
  }

  selected(message) {
    return this.#assert((assertApi, element) =>
      assertApi.selected(element, message)
    );
  }

  visible(message) {
    return this.#assert((assertApi, element) =>
      assertApi.visible(element, message)
    );
  }

  hasDescendants(message) {
    return this.#assert((assertApi, element) =>
      assertApi.hasDescendants(element, message)
    );
  }

  present(message) {
    return this.#assert((assertApi, element) =>
      assertApi.elementPresent(element, message)
    );
  }

  hasClass(name, message = `Testing if the element has "${name}" class.`) {
    const actions = this.nightwatchInstance.transportActions;

    const scopedValueAssertion = new ScopedValue(
      actions
        .executeScript(
          function (element, className) {
            return element.classList.contains(className);
          },
          [this.scopedElement.webElement, name]
        )
        .then(({value}) => value),
      this.nightwatchInstance
    ).assert;

    const assertion = this.negated
      ? scopedValueAssertion.not
      : scopedValueAssertion;

    assertion.equals(true, message);

    return this.scopedElement;
  }

  hasAttribute(
    name,
    message = `Testing if the element has "${name}" attribute.`
  ) {
    const actions = this.nightwatchInstance.transportActions;

    const scopedValueAssertion = new ScopedValue(
      actions
        .executeScript(
          function (element, attributeName) {
            return element.hasAttribute(attributeName);
          },
          [this.scopedElement.webElement, name]
        )
        .then(({value}) => value),
      this.nightwatchInstance
    ).assert;

    const assertion = this.negated
      ? scopedValueAssertion.not
      : scopedValueAssertion;

    assertion.equals(true, message);

    return this.scopedElement;
  }
}

module.exports.ScopedElementAssertions = ElementAssertions;
