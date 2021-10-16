const lodashMerge = require('lodash.merge');
const clone = require('lodash.clone');

const config = require('./cucumber-config.js');
const configCopy = clone(config);
const settings = lodashMerge(configCopy, {
  test_runner: {
    options: {
      auto_start_session: false
    }
  }
});

module.exports = settings;