const fs = require('fs');
const path = require('path');
const ApiLoader = require('../lib/mocks/assertionLoader.js');

module.exports = {
  runGroupGlobal(client, hookName, done) {
    const groupGlobal = path.join(__dirname, './globals/', client.currentTest.group.toLowerCase() + '.js');

    fs.stat(groupGlobal, function(err, stats) {
      if (err) {
        return done();
      }

      const global = require(groupGlobal);

      if (global[hookName]) {
        global[hookName].call(global, done);
      } else {
        done();
      }
    });
  },

  beforeEach(client, done) {
    if (client.currentTest.group) {
      this.runGroupGlobal(client, 'beforeEach', done);
    } else {
      done();
    }
  },

  afterEach(client, done) {
    if (client.currentTest.group) {
      this.runGroupGlobal(client, 'afterEach', done);
    } else {
      done();
    }
  },

  assertionTest(definition, done) {
    const loader = ApiLoader.create(`api/assertions/${definition.assertionName}.js`, definition.assertionName, definition.settings);

    if (definition.api) {
      Object.keys(definition.api).forEach(key => {
        loader.setApiMethod(key, definition.api[key]);
      });
    }

    loader.loadAssertion(definition.assertion, done);

    return loader.client.api.assert[definition.assertionName](...definition.args);
  }
};