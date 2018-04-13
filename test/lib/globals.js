const fs = require('fs');
const path = require('path');
const ApiLoader = require('../lib/mocks/assertionLoader.js');
const common = require('../common.js');
const Nightwatch = require('../lib/nightwatch.js');
const Settings = common.require('settings/settings.js');
const Runner = common.require('runner/runner.js');

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
  },

  protocolBefore() {
    this.client = Nightwatch.createClient();
    this.client.session.sessionId = this.client.api.sessionId = '1352110219202';

    this.protocol = common.require('api/protocol.js')(this.client);
  },

  protocolTest(definition) {
    this.client.transport.runProtocolAction = function(opts) {
      opts.method = opts.method || 'GET';
      definition.assertion(opts);

      return Promise.resolve();
    };

    this.protocol[definition.commandName](...definition.args);
  },

  startTestRunner(testsPath, suppliedSettings) {
    let settings = Settings.parse(suppliedSettings);
    let runner = Runner.create(settings, {
      reporter: 'junit'
    });

    if (!Array.isArray(testsPath)) {
      testsPath = [testsPath];
    }

    return Runner.readTestSource(settings, {
      _source: testsPath
    })
    .then(modules => {
      return runner.run(modules);
    })
    .then(_ => {
      return runner;
    });
  }
};