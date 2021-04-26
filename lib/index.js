const EventEmitter = require('events');
const HttpOptions = require('./http/options.js');
const HttpRequest = require('./http/request.js');
const Session = require('./core/session.js');
const Utils = require('./utils');
const Settings = require('./settings/settings.js');
const Transport = require('./transport/transport.js');
const Element = require('./element');
const ApiLoader = require('./api');

const {LocateStrategy, Locator} = Element;
const {Logger} = Utils;

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

  constructor(settings = {}, argv = {}) {
    super();

    this.setMaxListeners(0);

    this.settings = settings;
    Settings.setDefaults(this.settings);
    Logger.setOptions(this.settings);

    this.isES6AsyncTestcase = false;

    // backwards compatibility
    this.options = settings;
    this.__argv = argv;
    this.__locateStrategy = null;
    this.__httpOpts = HttpOptions.global;
    this.__transport = Transport.create(this);
    this.__session = new Session(this);
    this.__elementLocator = new Locator(this);
    this.__reporter = null;

    this.__api = new NightwatchAPI(this.sessionId, settings);

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
    return this.session.commandQueue;
  }

  get locateStrategy() {
    return this.__locateStrategy;
  }

  get configLocateStrategy() {
    return this.__configLocateStrategy;
  }

  get session() {
    return this.__session;
  }

  get sessionId() {
    return this.session.getSessionId();
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

            return method(definition).then((result) => Utils.makePromise(callback, api, [result]));
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
    this.setApiOption('desiredCapabilities', this.session.desiredCapabilities);

    return this;
  }

  setHttpOptions() {
    this.settings.webdriver = this.settings.webdriver || {};

    this
      .setWebdriverHttpOption('host', ['seleniumHost', 'selenium_host'], {defaultValue: 'localhost'})
      .setWebdriverHttpOption('port', ['seleniumPort', 'selenium_port'], {defaultValue: this.transport.defaultPort})
      .setWebdriverHttpOption('ssl', ['useSsl', 'use_ssl'], {defaultValue: false})
      .setWebdriverHttpOption('proxy')
      .setWebdriverHttpOption('timeout_options', 'request_timeout_options')
      .setWebdriverHttpOption('default_path_prefix', 'default_path_prefix', {defaultValue: this.transport.defaultPathPrefix})
      .setWebdriverHttpOption('username')
      .setWebdriverHttpOption('access_key', ['accessKey', 'access_key', 'password']);

    const webdriverOpts = this.settings.webdriver;
    const timeoutOptions = webdriverOpts.timeout_options || {};

    if (webdriverOpts.port) {
      this.httpOpts.setPort(webdriverOpts.port);
    }

    if (webdriverOpts.host) {
      this.httpOpts.setHost(webdriverOpts.host);
    }

    this.httpOpts.useSSL(webdriverOpts.ssl);
    this.httpOpts.setKeepAlive(webdriverOpts.keep_alive);

    if (webdriverOpts.proxy !== undefined) {
      this.httpOpts.setProxy(webdriverOpts.proxy);
    }

    if (typeof timeoutOptions.timeout != 'undefined') {
      this.httpOpts.setTimeout(timeoutOptions.timeout);
    }

    if (typeof timeoutOptions.retry_attempts != 'undefined') {
      this.httpOpts.setRetryAttempts(timeoutOptions.retry_attempts);
    }

    if (typeof webdriverOpts.default_path_prefix == 'string') {
      this.httpOpts.setDefaultPathPrefix(webdriverOpts.default_path_prefix);
    }

    if (webdriverOpts.username) {
      this
        .setApiOption('username', webdriverOpts.username)
        .setApiOption('accessKey', webdriverOpts.access_key);

      this.httpOpts.setCredentials({
        username: webdriverOpts.username,
        key: webdriverOpts.access_key
      });
    }

    HttpRequest.globalSettings = this.httpOpts.settings;

    return this;
  }

  setWebdriverHttpOption(newSetting, oldSetting, opts = {}) {
    let webdriverOpts = this.settings.webdriver;

    let isDefined = typeof webdriverOpts[newSetting] != 'undefined';
    if (isDefined) {
      return this;
    }

    if (oldSetting === undefined) {
      oldSetting = [newSetting];
    } else if (!Array.isArray(oldSetting)) {
      oldSetting = [oldSetting];
    }

    for (let i = 0; i < oldSetting.length; i++) {
      let item = oldSetting[i];
      let isDefined = typeof this.settings[item] != 'undefined';
      if (isDefined) {
        webdriverOpts[newSetting] = this.settings[item];

        return this;
      }
    }

    if (typeof opts.defaultValue != 'undefined' && typeof webdriverOpts[newSetting] == 'undefined') {
      webdriverOpts[newSetting] = opts.defaultValue;
    }

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

    if (this.startSessionEnabled) {
      this.setApiProperty('verify', {});
    }

    ApiLoader.init(this);
    const assertApi = Object.assign({}, this.__api.assert);
    const verifyApi = Object.assign({}, this.__api.verify);

    this.__api.assert = ApiLoader.makeAssertProxy(assertApi);
    this.__api.verify = ApiLoader.makeAssertProxy(verifyApi);

    return this;
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Session
  //////////////////////////////////////////////////////////////////////////////////////////
  /**
   * @return {Promise}
   */
  createSession(argv) {
    if (!this.session.startSessionEnabled) {
      return Promise.resolve();
    }

    this.session.on('session:finished', reason => {
      this.emit('nightwatch:finished', reason);
    });

    return this.session.create(argv)
      .then(data => {
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

Nightwatch.Logger = Logger;
