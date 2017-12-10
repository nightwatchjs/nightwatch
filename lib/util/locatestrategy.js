const __RECURSION__ = 'recursion';

class LocateStrategy {
  static get XPATH() {
    return 'xpath';
  }

  static get CSS_SELECTOR() {
    return 'css selector';
  }

  static getDefault() {
    return LocateStrategy.CSS_SELECTOR;
  }

  static get Recursion() {
    return __RECURSION__;
  }
}

module.exports = LocateStrategy;