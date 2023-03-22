const {By} = require('selenium-webdriver');
const {ScopedWebElement} = require('../index.js');

module.exports.command = function (text, {exact = true, ...options} = {}) {
  const findByForId = async (text, {exact, ...options}) => {
    const expr = exact ? `text()="${text}"` : `contains(text(),"${text}")`;
    const selector = By.xpath(`//label[${expr}]`);

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

  const findByAriaLabelled = async (text, {exact, ...options}) => {
    const expr = exact ? `text()="${text}"` : `contains(text(),"${text}")`;
    const selector = By.xpath(`//label[${expr}]`);

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

  const findByDirectNesting = async (text, {exact, ...options}) => {
    const expr = exact ? `text()="${text}"` : `contains(text(),"${text}")`;
    const selector = By.xpath(`//label[${expr}]`);

    const labelElement = await this.find({
      ...options,
      selector,
      suppressNotFoundErrors: true
    });

    if (!labelElement) {
      return null;
    }

    return labelElement.find({
      ...options,
      selector: By.css('input'),
      suppressNotFoundErrors: true
    });
  };

  const findByDeepNesting = async (text, {exact, ...options}) => {
    const selector = exact
      ? By.xpath(`//label[*[text() = "${text}"]]`)
      : By.xpath(`//label[*[contains(text(), "${text}")]]`);

    const labelElement = await this.find({
      ...options,
      selector,
      suppressNotFoundErrors: true
    });

    if (!labelElement) {
      return null;
    }

    return labelElement.find({
      ...options,
      selector: By.css('input'),
      suppressNotFoundErrors: true
    });
  };

  return ScopedWebElement.create(new Promise(async (resolve, reject) => {
    let element;

    try {
      element = await findByForId(text, {exact, ...options});
    } catch {
      // Ignore.
    }

    if (!element) {
      try {
        element = await findByAriaLabelled(text, {exact, ...options});
      } catch {
        // Ignore.
      }
    }

    if (!element) {
      try {
        element = await findByDirectNesting(text, {exact, ...options});
      } catch {
        // Ignore.
      }
    }

    if (!element) {
      try {
        element = await findByDeepNesting(text, {exact, ...options});
      } catch {
        // Ignore.
      }
    }

    if (!element) {
      try {
        element = await this.find({
          ...options,
          selector: By.css(`input[aria-label${exact ? '' : '*'}="${text}"]`),
          suppressNotFoundErrors: true
        });
      } catch {
        // Ignore.
      }
    }

    if (!element) {
      const error = new Error(`The element associated with label whose text ${exact ? 'equals' : 'contains'} "${text}" has not been found.`);
      reject(error);
    } else {
      resolve(element);
    }
  }), this, this.nightwatchInstance);
};


