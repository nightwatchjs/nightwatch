const __RECURSION__ = 'recursion';

class LocateStrategy {
  static get Strategies() {
    return {
      ID: 'id',
      CSS_SELECTOR: 'css selector',
      LINK_TEST: 'link text',
      PARTIAL_LINK_TEXT: 'partial link text',
      TAG_NAME: 'tag name',
      XPATH: 'xpath'
    };
  }

  static isValid(strategy) {
    return Object.keys(LocateStrategy.Strategies).some(key => {
      return String(strategy).toLocaleLowerCase() === LocateStrategy.Strategies[key];
    });
  }

  static getList() {
    return Object.keys(LocateStrategy.Strategies).map(k => LocateStrategy.Strategies[k]).join(', ');
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