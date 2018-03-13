const __RECURSION__ = 'recursion';

class LocateStrategy {
  static get Strategies() {
    return {
      CSS_SELECTOR: 'css selector',
      LINK_TEST: 'link text',
      PARTIAL_LINK_TEXT: 'partial link text',
      TAG_NAME: 'tag name',
      XPATH: 'xpath'
    };
  }

  static isValid(strategy) {
    let usingLow = String(strategy).toLocaleLowerCase();

    let isValid = Object.keys(LocateStrategy.Strategies).some(key => {
      return usingLow === LocateStrategy.Strategies[key];
    });

    if (!isValid) {
      let list = Object.keys(LocateStrategy.Strategies).map(k => LocateStrategy.Strategies[k]).join(', ');

      throw new Error(`Provided locating strategy "${strategy}" is not supported. It must be one of the following: ${list}.`);
    }

    return true;
  }

  static get XPATH() {
    return LocateStrategy.Strategies.XPATH;
  }

  static get CSS_SELECTOR() {
    return LocateStrategy.Strategies.CSS_SELECTOR;
  }

  static getDefault() {
    return LocateStrategy.CSS_SELECTOR;
  }

  static get Recursion() {
    return __RECURSION__;
  }
}

module.exports = LocateStrategy;