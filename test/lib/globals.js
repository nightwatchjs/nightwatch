const fs = require('fs');
const path = require('path');
const ApiLoader = require('../lib/mocks/assertionLoader.js');
const common = require('../common.js');
const Nightwatch = require('../lib/nightwatch.js');
const Settings = common.require('settings/settings.js');
const Runner = common.require('runner/runner.js');
const ProtocolActions = common.require('api/protocol.js');

let protocolInstance;
let protocolWDInstance;
const Globals = module.exports = {
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
    this.wdClient = Nightwatch.createClient({
      selenium: {
        version2: false,
        start_process: false
      },
      webdriver:{
        start_process: true
      }
    });

    this.client.session.sessionId = this.client.api.sessionId = '1352110219202';
    this.wdClient.session.sessionId = this.wdClient.api.sessionId = '1352110219202';

    protocolInstance = new ProtocolActions(this.client);
    protocolWDInstance = new ProtocolActions(this.wdClient);
  },

  protocolTest(definition) {
    return Globals.runProtocolTest(definition, this.client, protocolInstance);
  },

  protocolTestWebdriver(definition) {
    return Globals.runProtocolTest(definition, this.wdClient, protocolWDInstance);
  },

  runProtocolTest(definition, client, instance) {
    return new Promise((resolve, reject) => {
      client.transport.runProtocolAction = function(opts) {
        try {
          opts.method = opts.method || 'GET';
          definition.assertion(opts);

          return Promise.resolve({
            status: 0
          });
        } catch (err) {
          return Promise.reject(err);
        }
      };

      Globals.runApiCommand(instance, definition.commandName, definition.args)
        .then(err => {
          if (err instanceof Error) {
            reject(err);
            return;
          }
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  runApiCommand(instance, commandName, args) {
    instance = instance || protocolInstance;

    return instance.Actions[commandName].apply(instance, args);
  },

  startTestRunner(testsPath, suppliedSettings) {
    let settings = Settings.parse(suppliedSettings);
    let runner = Runner.create(settings, {
      reporter: 'junit'
    });

    if (!Array.isArray(testsPath)) {
      testsPath = [testsPath];
    }

    return Runner
      .readTestSource(settings, {
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
