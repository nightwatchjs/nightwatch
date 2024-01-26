const {By, Key, Capabilities} = require('selenium-webdriver');
const lodashMerge = require('lodash/merge');
const Utils = require('./utils');
const Settings = require('./settings/settings.js');
const ElementGlobal = require('./api/_loaders/element-global.js');
const NightwatchClient = require('./core/client.js');
const namespacedApi = require('./core/namespaced-api.js');
const {NightwatchEventHub} = require('./runner/eventHub');

const {Logger} = Utils;

const Nightwatch = module.exports = {};

/**
 * New programmatic api added in v2
 *
 * @param {Boolean} headless
 * @param {Boolean} silent
 * @param {Boolean} output
 * @param {Boolean} useAsync
 * @param {String} env
 * @param {String} browserName
 * @param {String} config
 * @param {number} timeout
 * @param {Boolean} parallel
 * @param {Object} globals
 * @param {Boolean} enable_global_apis
 * @param {Object} reporter
 *
 * @returns {{browser}}
 */
module.exports.createClient = function({
  headless = false,
  silent = true,
  output = true,
  useAsync = true,
  env = null,
  timeout = null,
  parallel = false,
  reporter = null,
  browserName = null,
  globals = {},
  devtools = false,
  debug = false,
  enable_global_apis = false,
  config = './nightwatch.json',
  disable_process_listener = false,
  test_settings
} = {}) {
  if (browserName && !env) {
    switch (browserName) {
      case 'firefox':
        env = 'firefox';
        break;

      case 'chrome':
        env = 'chrome';
        break;

      case 'safari':
        env = 'safari';
        break;

      case 'edge':
      case 'MicrosoftEdge':
        env = 'edge';
        break;
    }
  }

  const cliRunner = Nightwatch.CliRunner({
    config,
    headless,
    env,
    timeout,
    devtools,
    debug,
    parallel,
    disable_process_listener
  });

  const settings = arguments[0] || {};
  const allSettings = Object.keys(settings).reduce((prev, key) => {
    if (![
      'headless',
      'useAsync',
      'env',
      'timeout',
      'parallel',
      'reporter',
      'devtools',
      'debug',
      'browserName',
      'config'
    ].includes(key)) {
      prev[key] = settings[key];
    }

    return prev;
  }, {});

  cliRunner.setup({
    ...allSettings,
    silent,
    output,
    globals,
    always_async_commands: useAsync
  });

  cliRunner.test_settings.disable_global_apis = cliRunner.test_settings.disable_global_apis || !enable_global_apis;

  //merge settings recieved from testsuite to cli runner settings (this might have changed in hooks)
  lodashMerge(cliRunner.test_settings, test_settings);

  const client = Nightwatch.client(cliRunner.test_settings, reporter, cliRunner.argv, true);

  // TODO: Do we need this (global `element` api will only be available on
  // Nightwatch after `createClient` is called)? new `element` api is currently
  // available on Nightwatch as named-export, but it won't be once we migrate
  // to TypeScript, because then named-exports will be exported directly
  // instead of first adding them to Nightwatch (default export).
  // Some context: https://github.com/nightwatchjs/nightwatch/pull/3671
  Object.defineProperty(Nightwatch, 'element', {
    configurable: true,
    value: function(locator) {
      return ElementGlobal.element({locator, client});
    }
  });

  const exported = {
    updateCapabilities(value) {
      return client.mergeCapabilities(value);
    },

    runGlobalBeforeHook() {
      return cliRunner.globals.runGlobalHook('before', [client.settings]);
    },

    runGlobalAfterHook() {
      return cliRunner.globals.runGlobalHook('after', [client.settings]);
    },

    launchBrowser() {
      const {argv} = cliRunner;

      return client.initialize()
        .then(() => {
          return client.createSession({argv});
        })
        .then((data) => {
          if (this.settings.test_runner?.type === 'cucumber' && NightwatchEventHub.isAvailable) {
            const NightwatchFormatter = require('./runner/test-runners/cucumber/nightwatch-format');

            NightwatchFormatter.setCapabilities(data);
          }

          return client.api;
        })
        .catch((error) => {
          if (this.settings.test_runner?.type === 'cucumber' && NightwatchEventHub.isAvailable) {
            const NightwatchFormatter = require('./runner/test-runners/cucumber/nightwatch-format');

            NightwatchFormatter.setCapabilities({
              error: error
            });
          }

          throw error;
        });
    },

    async cleanup() {
      await client.queue.waitForCompletion();
      client.queue.empty();
      client.queue.reset();
      client.queue.removeAllListeners();
      Logger.reset();
    }
  };

  Object.defineProperties(exported, {
    settings: {
      configurable: true,
      get: function() {
        return client.settings;
      }
    },
    transport: {
      get: function() {
        return client.transport;
      }
    },
    nightwatch_client: {
      configurable: true,
      get: function() {
        return client;
      }
    }
  });

  return exported;
};

/**
 * @param settings
 * @param reporter
 * @param argv
 * @returns {NightwatchClient}
 */
Nightwatch.client = function(settings, reporter = null, argv = {}, skipInit = true) {
  const client = NightwatchClient.create(settings, argv);

  if (reporter === null) {
    const SimplifiedReporter = require('./reporter/simplified.js');
    reporter = new SimplifiedReporter(settings);
  }

  client
    .createTransport()
    .setReporter(reporter);

  if (skipInit) {
    return client;
  }

  return client.initialize();
};

Nightwatch.cli = function(callback) {
  const ArgvSetup = require('./runner/cli/argv-setup.js');
  const {argv} = ArgvSetup;

  if (argv['list-files']) {
    argv._source = argv['_'].slice(0);
    const runner = Nightwatch.CliRunner(argv);

    return runner.setupAsync()
      .then(() => runner.getTestsFiles())
      // eslint-disable-next-line no-console
      .then((result) => console.log(JSON.stringify(result)));
  }

  if (argv.help) {
    ArgvSetup.showHelp();
  } else if (argv.info) {
    // eslint-disable-next-line no-console
    console.log('  Environment Info:');

    require('envinfo').run(
      {
        System: ['OS', 'CPU'],
        Binaries: ['Node', 'Yarn', 'npm'],
        Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari']
      },
      {
        showNotFound: true,
        duplicates: true,
        fullTree: true
      }// eslint-disable-next-line no-console
    ).then(console.log);
  } else if (argv.version) {
    Utils.printVersionInfo();
  } else {
    if (!Utils.isFunction(callback)) {
      throw new Error('Supplied callback argument needs to be a function.');
    }

    callback(argv);
  }
};

/**
 *
 * @param [testSource]
 * @param [settings]
 */
Nightwatch.runTests = async function(testSource, settings) {
  let argv;

  if (arguments.length <= 1) {
    settings = arguments[0] || {};
    argv = {};
  } else if (Array.isArray(testSource)) {
    argv = {
      _source: testSource
    };
  } else if (Utils.isObject(testSource)) {
    argv = testSource;
  } else if (Utils.isString(testSource)) {
    argv = {
      _source: [testSource]
    };
  }

  if (argv.source) {
    argv._source = argv.source;
  }
  argv.reporter = argv.reporter || Settings.DEFAULTS.default_reporter;

  if (!Array.isArray(argv.reporter)) {
    argv.reporter = [argv.reporter];
  }

  try {
    const runner = Nightwatch.CliRunner(argv);

    await runner.setupAsync(settings);

    return runner.runTests();
  } catch (err) {
    return Promise.reject(err);
  }
};

Nightwatch.CliRunner = function(argv = {}) {
  const CliRunner = require('./runner/cli/cli.js');

  return new CliRunner(argv);
};

/**
 * @param opts
 * @return {*}
 */
Nightwatch.initClient = function(opts = {}) {
  const cliRunner = Nightwatch.CliRunner();
  cliRunner.initTestSettings(opts);

  return Nightwatch.client(cliRunner.settings);
};

/**
 * @deprecated
 * @param argv
 * @param done
 * @param settings
 * @return {*|CliRunner}
 */
Nightwatch.runner = function(argv = {}, done = function() {}, settings = {}) {
  if (argv.source) {
    argv._source = argv.source;
  }
  argv.reporter = Settings.DEFAULTS.default_reporter;

  const runner = Nightwatch.CliRunner(argv);

  return runner.setup(settings)
    .runTests()
    .catch(err => {
      runner.processListener.setExitCode(10);

      return err;
    })
    .then(err => {
      return done(err);
    });
};

Object.defineProperty(Nightwatch, 'Logger', {
  configurable: true,
  get() {
    const {logMessage, colors, underline, error, enable, disable, disableColors, isEnabled, inspectObject, request} = Logger;

    return {
      spinner(message) {
        const ora = require('ora');

        return ora(message).start();
      },
      log(message, ...args) {
        logMessage('LOG', message, args, true);
      },
      info(message, ...args) {
        logMessage('INFO', message, args, true);
      },
      warn(message, ...args) {
        logMessage('WARN', message, args, true);
      },
      colors,
      error,
      underline,
      enable,
      disable,
      disableColors,
      isEnabled,
      inspectObject,
      request
    };
  }
});

Object.defineProperty(Nightwatch, 'by', {
  configurable: true,
  get() {
    return By;
  }
});

function throwIfBrowserNotAvailable() {
  if (!global.browser) {
    const err = new TypeError('Nightwatch client is not yet available.');
    err.addDetailedErr = true;
    throw err;
  }
}

Object.defineProperty(Nightwatch, 'Key', {
  configurable: true,
  get() {
    return Key;
  }
});

Object.defineProperty(Nightwatch, 'Capabilities', {
  configurable: true,
  get() {
    return Capabilities;
  }
});

// Named exports
const {
  browser, app, appium, alerts, cookies, document, window,
  chrome, firefox, assert, verify, expect, element
} = namespacedApi;

// browser and app are overwritten below using `Object.defineProperty()`.
module.exports.browser = browser;
module.exports.app = app;

module.exports.appium = appium;
module.exports.alerts = alerts;
module.exports.cookies = cookies;
module.exports.document = document;
module.exports.window = window;

module.exports.chrome = chrome;
module.exports.firefox = firefox;

module.exports.assert = new Proxy(assert, {
  get(_, name) {
    return namespacedApi.assert[name];
  }
});
module.exports.verify = new Proxy(verify, {
  get(_, name) {
    return namespacedApi.verify[name];
  }
});
module.exports.expect = new Proxy(expect, {
  apply(_, __, args) {
    throwIfBrowserNotAvailable();

    return global.browser.expect(...args);
  },
  get(_, name) {
    throwIfBrowserNotAvailable();

    return global.browser.expect[name];
  }
});

module.exports.element = new Proxy(element, {
  apply(_, __, args) {
    throwIfBrowserNotAvailable();

    return global.browser.element(...args);
  },
  get(_, name) {
    throwIfBrowserNotAvailable();

    return global.browser.element[name];
  }
});

const globalBrowserDescriptor = {
  configurable: true,
  get() {
    throwIfBrowserNotAvailable();

    return global.browser;
  }
};
Object.defineProperty(Nightwatch, 'browser', globalBrowserDescriptor);
Object.defineProperty(Nightwatch, 'app', globalBrowserDescriptor);
