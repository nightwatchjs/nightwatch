const BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
const path = require('path');

const common = module.exports = {
  require(relativeFilePath) {
    return require(path.join('../', BASE_PATH, relativeFilePath));
  },

  resolve(relativeFilePath) {
    return path.join('../', BASE_PATH, relativeFilePath);
  },

  requireMock(relativeFilePath, ...args) {
    let mockedModule = require(path.join(__dirname, './lib/mocks', relativeFilePath));

    return mockedModule(...args);
  }
};