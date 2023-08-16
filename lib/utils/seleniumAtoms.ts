const getAttribute = 'get-attribute.js';
const isDisplayed = 'is-displayed.js';
const findElements = 'find-elements.js';

const path = require('path');
const SELENIUM_ATOMS_PATH = path.join(path.dirname(require.resolve('selenium-webdriver')), 'lib', 'atoms');

/**
 * @param {string} module
 * @return {!Function}
 */
function requireAtom(module: string): Function {
  try {
    return require(path.join(SELENIUM_ATOMS_PATH, module));
  } catch (ex: any) {
    throw Error(`Failed to import atoms module ${module} using Selenium path: ${SELENIUM_ATOMS_PATH}`);
  }
}

module.exports = {
  requireIsDisplayed(): Function {
    return requireAtom(isDisplayed);
  }
};

