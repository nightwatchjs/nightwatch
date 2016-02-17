var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var path = require('path');

module.exports = {
  require : function(relativeFilePath) {
    return require(path.join('../', BASE_PATH, relativeFilePath));
  },
  resolve : function(relativeFilePath) {
    return path.join('../', BASE_PATH, relativeFilePath);
  }
};