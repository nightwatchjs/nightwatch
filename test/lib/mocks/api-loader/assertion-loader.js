const common = require('../../../common.js');
const AssertionLoader = common.require('api-loader/assertion-loader.js');

module.exports = function(commandName, assertionModule) {

  class AssertionLoaderMock extends AssertionLoader {
    loadModule(dirpath, filename) {
      this.commandName = commandName;
      this.__module = assertionModule;

      return this;
    }
  }

  return AssertionLoaderMock;
};