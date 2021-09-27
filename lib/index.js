const EventEmitter = require('events');
const {By, Key, Capabilities} = require('selenium-webdriver');

const HttpOptions = require('./http/options.js');
const HttpRequest = require('./http/request.js');
const Utils = require('./utils');
const Settings = require('./settings/settings.js');
const CommandQueue = require('./core/queue.js');
const Transport = require('./transport');
const Element = require('./element');
const ApiLoader = require('./api');
const ElementGlobal = require('./api/_loaders/element-global.js');

const {LocateStrategy, Locator} = Element;
const {Logger, isUndefined, isDefined} = Utils;

class NightwatchAPI {
  get WEBDRIVER_ELEMENT_ID() {
    return Transport.WEB_ELEMENT_ID;
  }

  toString() {
    return 'Nightwatch API';
  }

  constructor(sessionId, settings) {
    this.capabilities = {};
    this.currentTest = null;
    this.desiredCapabilities = null;
    this.sessionId = sessionId;
    this.options = settings;
    this.globals = settings.globals;
  }
}

class NightwatchClient extends EventEmitter {

  constructor(userSettings = {}, argv = {}) {
    super();

    this.setMaxListeners(0);

    this.settings = Settings.fromClient(userSettings, argv);
    Logger.setOptions(this.settings);

    this.isES6AsyncTestcase = false;
    this.isES6AsyncCommand = false;

    // backwards compatibility
    this.options = this.settings;
    this.__sessionId = null;
    this.__argv = argv;
    this.__locateStrategy = null;
    this.__httpOpts = HttpOptions.global;

    this.createTransport();
    this.createCommandQueue();

    this.__elementLocator = new Locator(this);
    this.__reporter = null;

    this.__api = new NightwatchAPI(this.sessionId, this.settings);

    this
      .setLaunchUrl()
      .setScreenshotOptions()
      .setConfigLocateStrategy()
      .setLocateStrategy()
      .setSessionOptions()
      .setHttpOptions();
  }

  get api() {
    return this.__api;
  }

  get argv() {
    return this.__argv;
  }

  get queue() {
    return this.__commandQueue;
  }

  get locateStrategy() {
    return this.__locateStrategy;
  }

  get configLocateStrategy() {
    return this.__configLocateStrategy;
  }

  get sessionId() {
    return this.getSessionId();
  }

  getSessionId() {
    return this.__sessionId;
  }

  set sessionId(val) {
    this.__sessionId = val;
  }

  get transport() {
    return this.__transport;
  }

  get transportActions() {
    const actions = this.transport.Actions;
    const api = this.api;

    return new Proxy(actions, {
      get(target, name) {
        return function (...args) {
          let callback;
          let method;
          let sessionId = api.sessionId;
          let lastArg = args[args.length-1];
          let isLastArgFunction = Utils.isFunction(lastArg);

          if (isLastArgFunction) {
            callback = args.pop();
          } else if (args.length === 0 || !isLastArgFunction) {
            callback = function(result) {return result};
          }

          const definition = {
            args
          };

          if (Array.isArray(args[0]) && Utils.isString(lastArg)) {
            sessionId = lastArg;
            definition.args = args[0];
          }

          if (Utils.isString(name)) {
            if (name in target.session) { // actions that require the current session
              method = target.session[name];
              definition.sessionId = api.sessionId || sessionId;
            } else {
              method = target[name];
            }

            //return method(definition).then((result) => Utils.makePromise(callback, api, [result]));

            return method(definition)
              .then(async (result) => {
                const newResult = await Utils.makePromise(callback, api, [result]);

                if (Utils.isUndefined(newResult)) {
                  return result;
                }

                return newResult;
              });
          }

          if (typeof name == 'symbol') {
            // this is in case of console.log(this.transportActions)
            const util = require('util');
            let result = Object.keys(target).reduce((prev, key) => {
              if (key === 'session') {
                return prev;
              }

              prev[key] = target[key];

              return prev;
            }, {});

            Object.assign(result, target.session);

            const sorted = Object.keys(result).sort().reduce((prev, key) => {
              prev[key] = result[key];

              return prev;
            }, {});

            return util.inspect(sorted);
          }

          return Promise.resolve();
        };
      }
    });
  }

  get elementLocator() {
    return this.__elementLocator;
  }

  get httpOpts() {
    return this.__httpOpts;
  }

  get startSessionEnabled() {
    return this.settings.start_session;
  }

  get unitTestingMode() {
    return this.settings.unit_tests_mode;
  }

  screenshotsEnabled() {
    return Utils.isObject(this.settings.screenshots) ? (this.settings.screenshots && this.options.screenshots.enabled === true) : false;
  }

  get reporter() {
    return this.__reporter || {};
  }

  get client() {
    const {settings, api, locateStrategy, reporter, sessionId, elementLocator} = this;

    return {
      options: settings,
      settings,
      api,
      locateStrategy,
      reporter,
      sessionId,
      elementLocator
    };
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Setters
  //////////////////////////////////////////////////////////////////////////////////////////
  setApiProperty(key, value) {
    if (Utils.isFunction(value)) {
      Object.defineProperty(this.__api, key, {
        get: value
      });
    } else {
      this.__api[key] = value;
    }


    return this;
  }

  setApiOption(key, value) {
    this.__api.options[key] = value;

    return this;
  }

  /**
   *
   * @param key
   * @param args
   * @return {NightwatchClient}
   */
  setApiMethod(key, ...args) {
    let fn;
    let context = this.__api;

    if (args.length === 1) {
      fn = args[0];
    } else if (args.length === 2) {
      let namespace = typeof args[0] == 'string' ? context[args[0]] : args[0];
      if (namespace) {
        context = namespace;
      }

      fn = args[1];
    }

    if (!fn) {
      throw new Error('Method must be a declared.');
    }

    context[key] = fn;

    return this;
  }

  /**
   *
   * @param {string} key
   * @param {string|object} namespace
   * @return {boolean}
   */
  isApiMethodDefined(key, namespace) {
    let api = this.__api;
    if (namespace) {
      api = typeof namespace == 'string' ? api[namespace] : namespace;

      if (api === undefined) {
        return false;
      }
    }

    return api[key] !== undefined;
  }

  setReporter(reporter) {
    this.__reporter = reporter;

    return this;
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Options
  //////////////////////////////////////////////////////////////////////////////////////////
  /**
   * @deprecated
   */
  endSessionOnFail(val) {
    if (arguments.length === 0) {
      return this.settings.end_session_on_fail;
    }

    this.settings.end_session_on_fail = val;
  }

  setLaunchUrl() {
    let value = this.settings.launchUrl || this.settings.launch_url || null;
    this.setApiProperty('launchUrl', value).setApiProperty('launch_url', value);

    return this;
  }

  setScreenshotOptions() {
    const {screenshots} = this.settings;

    if (this.screenshotsEnabled()) {
      this.setApiProperty('screenshotsPath', screenshots.path)
        .setApiOption('screenshotsPath', screenshots.path);
    }

    return this;
  }

  setConfigLocateStrategy() {
    this.__configLocateStrategy = this.settings.use_xpath ? LocateStrategy.XPATH : LocateStrategy.CSS_SELECTOR;

    return this;
  }

  setLocateStrategy(strategy = null) {
    if (strategy && LocateStrategy.isValid(strategy)) {
      this.__locateStrategy = strategy;

      return this;
    }

    this.__locateStrategy = this.configLocateStrategy;

    return this;
  }

  setSessionOptions() {
    this.setApiOption('desiredCapabilities', this.transport.desiredCapabilities);

    return this;
  }

  setHttpOptions() {
    this.settings.webdriver = this.settings.webdriver || {};

    if (isUndefined(this.settings.webdriver.port)) {
      this.settings.webdriver.port = this.transport.defaultPort;
    }

    if (isUndefined(this.settings.webdriver.default_path_prefix)) {
      this.settings.webdriver.default_path_prefix = this.transport.defaultPathPrefix;
    }

    if (this.argv.parallel && this.settings.webdriver.start_process) {
      // when running in parallel with test workers, the port needs to be randomly assigned
      this.settings.webdriver.port = undefined;
    }

    const {
      port,
      host,
      timeout_options = {},
      ssl = false,
      keep_alive,
      proxy,
      default_path_prefix,
      username,
      access_key
    } = this.settings.webdriver;

    if (port) {
      this.httpOpts.setPort(port);
    }

    if (host) {
      this.httpOpts.setHost(host);
    }

    this.httpOpts.useSSL(ssl);
    this.httpOpts.setKeepAlive(keep_alive);

    if (isDefined(proxy)) {
      this.httpOpts.setProxy(proxy);
    }

    if (isDefined(timeout_options.timeout)) {
      this.httpOpts.setTimeout(timeout_options.timeout);
    }

    if (isDefined(timeout_options.retry_attempts)) {
      this.httpOpts.setRetryAttempts(timeout_options.retry_attempts);
    }

    if (isDefined(default_path_prefix)) {
      this.httpOpts.setDefaultPathPrefix(default_path_prefix);
    }

    if (username && isDefined(access_key)) {
      this
        .setApiOption('username', username)
        .setApiOption('accessKey', access_key);

      this.httpOpts.setCredentials({
        username: username,
        key: access_key
      });
    }

    HttpRequest.globalSettings = this.httpOpts.settings;

    return this;
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Initialize the APIs
  //////////////////////////////////////////////////////////////////////////////////////////

  initialize() {
    this
      .loadKeyCodes()
      .loadNightwatchApis();
  }

  setCurrentTest() {
    this.setApiProperty('currentTest', () => this.reporter.currentTest);

    return this;
  }

  loadKeyCodes() {
    this.setApiProperty('Keys', require('./api/keys.json'));

    return this;
  }

  loadNightwatchApis() {
    this.setApiProperty('page', {});
    this.setApiProperty('assert', {});
    this.setApiProperty('verify', {});

    if (!this.unitTestingMode) {
      this.setApiProperty('ensure', {});
      this.setApiProperty('chrome', {});
      this.setApiProperty('firefox', {});

      Object.defineProperty(this.__api, 'driver', {
        configurable: true,
        enumerable: true,
        get: function() {
          return this.transport.driver;
        }.bind(this)
      });

      this.setApiMethod('actions', (opts) => {
        return this.transport.driver.actions(opts);
      });
    }

    ApiLoader.init(this);
    const assertApi = Object.assign({}, this.__api.assert);
    const verifyApi = Object.assign({}, this.__api.verify);

    if (!this.unitTestingMode) {
      const ensureApi = Object.assign({}, this.__api.ensure);
      this.__api.ensure = ApiLoader.makeAssertProxy(ensureApi);
    }

    this.__api.assert = ApiLoader.makeAssertProxy(assertApi);
    this.__api.verify = ApiLoader.makeAssertProxy(verifyApi);


    return this;
  }

  createTransport() {
    this.__transport = Transport.create(this);

    return this;
  }

  createCommandQueue() {
    this.__commandQueue = new CommandQueue({
      compatMode: this.settings.backwards_compatibility_mode
    });
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Session
  //////////////////////////////////////////////////////////////////////////////////////////
  /**
   * @return {Promise}
   */
  createSession(argv) {
    if (!this.startSessionEnabled) {
      return Promise.resolve();
    }

    this.transport.on('session:finished', reason => {
      this.emit('nightwatch:finished', reason);
    });

    return this.transport.createSession(argv)
      .then(data => {
        this.sessionId = data.sessionId;
        this.setApiProperty('sessionId', data.sessionId);
        this.setApiProperty('capabilities', data.capabilities);

        Logger.info(`Received session with ID: ${data.sessionId}\n`);

        this.emit('nightwatch:session.create', data);

        return data;
      });
  }

  /**
   * @deprecated
   * @return {Promise}
   */
  startSession() {
    return this.createSession();
  }
}

const Nightwatch = module.exports = {};

/**
 * New programmatic api added in v2
 *
 * @param {Boolean} headless
 * @param {Boolean} silent
 * @param {Boolean} output
 * @param {Boolean} useAsync
 * @param {String} env
 * @param {number} timeout
 * @param {Boolean} parallel
 * @param {verbose} verbose
 * @param {Object} reporter
 *
 * @returns {{browser}}
 */
Nightwatch.createClient = function({
  headless = true,
  silent = true,
  output = true,
  useAsync = true,
  env = null,
  timeout = null,
  parallel = false,
  reporter = null,
  desiredCapabilities,
  browserName = null,
  globals = {},
  config = './nightwatch.json'
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
    parallel
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
    always_async_commands: useAsync,
    desiredCapabilities,
    globals
   
  });

  const client = Nightwatch.client(cliRunner.test_settings, reporter, cliRunner.argv);

  Object.defineProperty(Nightwatch, 'element', {
    configurable: true,
    value: function(locator) {
      return ElementGlobal.element({locator, client});
    }
  });

  return {
    session() {
      return client.createSession(cliRunner.argv).then(_ => {
        return client.api;
      });
    }
  };
};

/**
 * @param settings
 * @param reporter
 * @param argv
 * @returns {NightwatchClient}
 */
Nightwatch.client = function(settings, reporter = null, argv = {}) {
  const client = new NightwatchClient(settings, argv);

  if (reporter === null) {
    const SimplifiedReporter = require('./reporter/simplified.js');
    reporter = new SimplifiedReporter(settings);
  }

  client.setReporter(reporter).initialize();

  return client;
};

Nightwatch.cli = function(callback) {
  const ArgvSetup = require('./runner/cli/argv-setup.js');
  const {argv} = ArgvSetup;

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
    let packageConfig = require(__dirname + '/../package.json');
    // eslint-disable-next-line no-console
    console.log('  Nightwatch:');
    // eslint-disable-next-line no-console
    console.log('    version: ' + packageConfig.version);
    // eslint-disable-next-line no-console
    console.log('    changelog: https://github.com/nightwatchjs/nightwatch/releases/tag/v' + packageConfig.version + '\n');
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
Nightwatch.runTests = function(testSource, settings) {
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
  argv.reporter = Settings.DEFAULTS.default_reporter;

  try {
    const runner = Nightwatch.CliRunner(argv);

    return runner.setup(settings).runTests();
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
  get: function() {
    const {logMessage, underline, error, enable, disable, disableColors, isEnabled} = Logger;

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
      error,
      underline,
      enable,
      disable,
      disableColors,
      isEnabled
    };
  }
});

Object.defineProperty(Nightwatch, 'by', {
  configurable: true,
  get: function() {
    return By;
  }
});

Object.defineProperty(Nightwatch, 'Key', {
  configurable: true,
  get: function() {
    return Key;
  }
});

Object.defineProperty(Nightwatch, 'Capabilities', {
  configurable: true,
  get: function() {
    return Capabilities;
  }
});