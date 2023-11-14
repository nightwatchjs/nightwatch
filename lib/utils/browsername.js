const BrowserName = module.exports = {
  get CHROME() {
    return 'chrome';
  },

  get FIREFOX() {
    return 'firefox';
  },

  get SAFARI() {
    return 'safari';
  },

  get EDGE() {
    return 'MicrosoftEdge';
  },

  get INTERNET_EXPLORER() {
    return 'internet explorer';
  },

  get OPERA() {
    return 'opera';
  }
};

Object.freeze(BrowserName);
