const LocateStrategy = {
  XPATH : 'xpath',
  CSS_SELECTOR : 'css selector',

  getDefault() {
    return LocateStrategy.CSS_SELECTOR;
  }
};

module.exports = LocateStrategy;