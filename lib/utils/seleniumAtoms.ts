import path from 'path';

const getAttribute = 'get-attribute.js';
const isDisplayed = 'is-displayed.js';
const findElements = 'find-elements.js';

const SELENIUM_ATOMS_PATH = path.join(path.dirname(require.resolve('selenium-webdriver')), 'lib', 'atoms');

function requireAtom(module: string): unknown {
  try {
    return require(path.join(SELENIUM_ATOMS_PATH, module));
  } catch (ex) {
    throw Error(`Failed to import atoms module ${module} using Selenium path: ${SELENIUM_ATOMS_PATH}`);
  }
}

export = {
  requireIsDisplayed() {
    return requireAtom(isDisplayed);
  }
};

