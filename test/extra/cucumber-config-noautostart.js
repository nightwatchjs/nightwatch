const path = require('path');
const lodashMerge = require('lodash.merge');
const clone = require('lodash.clone');

const config = require('./cucumber-config.js');
const configCopy = clone(config);
const settings = lodashMerge(configCopy, {
  selenium: {
    port: 10193
  },
  test_runner: {
    options: {
      auto_start_session: false,
      feature_path: path.join(__dirname, '../cucumber-integration-tests/sample_cucumber_tests/with-extra-setup/sample.feature')
    }
  }
});

module.exports = settings;