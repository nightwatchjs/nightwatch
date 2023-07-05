const BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'dist';
const path = require('path');

module.exports = {
  require(relativeFilePath) {
    return require(path.join('../', BASE_PATH, relativeFilePath));
  },

  requireApi(relativeFilePath) {
    return require(path.join('../api', relativeFilePath));
  },

  resolve(relativeFilePath) {
    return path.join('../', BASE_PATH, relativeFilePath);
  },

  requireMock(relativeFilePath, ...args) {
    const mockedModule = require(path.join(__dirname, './lib/mocks', relativeFilePath));

    return mockedModule(...args);
  },

  settings(settings) {
    return Object.assign({
      selenium: {
        port: 10195,
        start_process: false
      },
      selenium_host: 'localhost',
      persist_globals: true,
      output_folder: false,
      output: false,
      silent: false
    }, settings);
  }
};

// process.on('unhandledRejection', err => {
//   console.error('TEST unhandledRejection:')
//   console.error(err.stack);
// });
