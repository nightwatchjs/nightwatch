const {By} = require('selenium-webdriver');

/**
 * Search for the label that matches the given text, then find the element associated with that label.
 * Element can be searched by using another element as the starting point.
 * By default, provided text is treated as a substring, so for the `'foo'` will match `'foobar'` also.
 * If you need an exact comparison, provide the `{ exact: true }` as the second parameter.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     // Search by the substring matching.
 *     const image = browser.element.findByLabelText('dreamers');
 *
 *     // Search for the exact occurrence.
 *     const image = browser.element.findByLabelText(
 *       'A group of people sitting in front of a computer.',
 *       { exact: true }
 *     );
 *   }
 * }
 *
 * @since 3.0.0
 * @method findByLabelText
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element.findByLabelText(text, [options])
 * @param {string} text
 * @param {{exact: boolean}} [options]
 * @returns {ScopedWebElement}
 */
module.exports.command = function (text, {exact = true, timeout, retryInterval, suppressNotFoundErrors} = {}) {

  const findByForId = async (instance, labelElement) => {
    if (!labelElement) {
      return null;
    }

    const forAttribute = await labelElement.getAttribute('for');

    if (!forAttribute) {
      return null;
    }

    const element = await instance.waitUntilElementsLocated({
      selector: By.css(`input[id="${forAttribute}"]`),
      timeout,
      retryInterval
    });

    return element;
  };

  const findByAriaLabelled = async (instance, labelWebElement) => {
    if (!labelWebElement) {
      return null;
    }

    const idAttribute = await labelWebElement.getAttribute('id');

    if (!idAttribute) {
      return null;
    }

    return instance.waitUntilElementsLocated({
      selector: By.css(`input[aria-labelledby="${idAttribute}"]`),
      timeout,
      retryInterval
    });
  };

  const findByDirectNesting = async (labelWebElement) => {
    if (!labelWebElement) {
      return null;
    }

    try {
      return await labelWebElement.findElement(By.css('input'));
    } catch (err) {
      return null;
    }
  };

  const findByDeepNesting = async (text, {exact}) => {
    const expr = exact ? `*[text()="${text}"]` : `*[contains(text(), "${text}")]`;
    const selector = By.xpath(`.//label[${expr}]`);

    const labelElement = await this.find({
      selector,
      timeout,
      retryInterval,
      suppressNotFoundErrors: true
    });

    if (!labelElement) {
      return null;
    }

    try {
      return await labelElement.findElement(By.css('input'));
    } catch (err) {
      return null;
    }
  };

  const findByAriaLabel = async (text, {exact}) => {
    const labelElement = await this.find({
      selector: By.css(`input[aria-label${exact ? '' : '*'}="${text}"]`),
      timeout,
      retryInterval,
      suppressNotFoundErrors: true
    });

    return labelElement;
  };

  const findFromLabel = async (instance, labelElement) => {
    let element = null;

    if (labelElement) {
      try {
        element = await findByForId(instance, labelElement);
      } catch (err) {
        // ignore
      }

      if (!element) {
        try {
          element = await findByAriaLabelled(instance, labelElement);
        } catch (err) {
          // ignore
        }
      }

      if (!element) {
        try {
          element = await findByDirectNesting(labelElement);
        } catch (err) {
          // ignore
        }
      }
    }

    return element;
  };

  const createAction = function (labelElement) {
    const instance = this;

    return async function() {
      const element = await findFromLabel(instance, labelElement);

      if (element) {
        return element;
      }

      const error = new Error(`The element associated with label whose text ${exact ? 'equals' : 'contains'} "${text}" has not been found.`);
      if (!suppressNotFoundErrors) {
        throw error;
      }

      return null;
    };
  };

  const expr = exact ? `text()="${text}"` : `contains(text(),"${text}")`;
  const selector = By.xpath(`.//label[${expr}]`);

  // eslint-disable-next-line no-async-promise-executor
  return this.createScopedElement(new Promise(async (resolve, reject) => {
    const labelElement = await this.find({
      selector,
      timeout,
      retryInterval,
      suppressNotFoundErrors: true
    });

    if (labelElement) {
      const node = this.queueAction({name: 'findByLabelText', createAction: function () {
        return createAction.call(this, labelElement);
      }});

      node.deferred.promise.then(resolve, reject);

      return;
    }

    const byDeepNesting = await findByDeepNesting(text, {exact});
    if (byDeepNesting) {
      return resolve(byDeepNesting);
    }

    const byAriaLabel = await findByAriaLabel(text, {exact});
    if (byAriaLabel) {
      return resolve(byAriaLabel);
    }

    resolve(null);
  }));
};
