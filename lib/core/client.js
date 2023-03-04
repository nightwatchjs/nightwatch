const EventEmitter = require('events');
const {Key, Capabilities, Browser} = require('selenium-webdriver');

const HttpOptions = require('../http/options.js');
const HttpRequest = require('../http/request.js');
const Utils = require('../utils');
const Settings = require('../settings/settings.js');
const CommandQueue = require('./queue.js');
const Transport = require('../transport');
const Element = require('../element');
const ApiLoader = require('../api');
const ElementGlobal = require('../api/_loaders/element-global.js');
const Factory = require('../transport/factory.js');
const {isAndroid, isIos} = require('../utils/mobile');

const {LocateStrategy, Locator} = Element;
const {Logger, isUndefined, isDefined, isObject, isFunction, isSafari} = Utils;

class NightwatchAPI {
  get WEBDRIVER_ELEMENT_ID() {
    return Transport.WEB_ELEMENT_ID;
  }

  get browserName() {
    if (this.capabilities && this.capabilities.browserName) {
      return this.capabilities.browserName;
    }

    if (this.desiredCapabilities instanceof Capabilities) {
      return this.desiredCapabilities.getBrowserName();
    }

    return this.desiredCapabilities.browserName;
  }

  get platformName() {
    if (this.capabilities && this.capabilities.platformName) {
      return this.capabilities.platformName;
    }

    if (this.desiredCapabilities instanceof Capabilities) {
      return this.desiredCapabilities.getPlatform();
    }

    return this.desiredCapabilities.platformName;
  }

  toString() {
    return 'Nightwatch API';
  }

  constructor(sessionId, settings) {
    // session returned capabilities
    this.capabilities = {};
    this.currentTest = null;

    // requested capabilities
    this.desiredCapabilities = settings.capabilities instanceof Capabilities ? settings.capabilities : settings.desiredCapabilities;
    this.sessionId = sessionId;
    this.options = settings;
    this.globals = settings.globals;
  }

  __isBrowserName(browser, alternateName) {
    const lowerCaseBrowserName = this.browserName && this.browserName.toLowerCase();
    const browserNames = [this.browserName, lowerCaseBrowserName];

    if (alternateName) {
      return [browser, alternateName].some(name => browserNames.includes(name));
    }

    return browserNames.includes(browser);
  }

  __isPlatformName(platform) {
    if (typeof this.platformName === 'undefined') {
      return false;
    }

    return this.platformName.toLowerCase() === platform.toLowerCase(); 
  }

  isIOS() {
    return isIos(this.desiredCapabilities);
  }

  isAndroid() {
    return isAndroid(this.desiredCapabilities);
  }

  isMobile() {
    return this.isIOS() || this.isAndroid();
  }

  isSafari() {
    return isSafari(this.desiredCapabilities);
  }

  isChrome() {
    return this.__isBrowserName(Browser.CHROME);
  }

  isFirefox() {
    return this.__isBrowserName(Browser.FIREFOX);
  }

  isEdge() {
    return this.__isBrowserName(Browser.EDGE, 'edge');
  }

  isInternetExplorer() {
    return this.__isBrowserName(Browser.INTERNET_EXPLORER);
  }

  isOpera() {
    return this.capabilities.browserName === Browser.OPERA;
  }

  isAppiumClient() {
    if (this.options.selenium && this.options.selenium.use_appium) {
      return true;
    }

    // Handle BrowserStack case
    // (BrowserStack always returns platformName in capabilities)
    const isMobile = this.__isPlatformName('android') || this.__isPlatformName('ios');
    if (Factory.usingBrowserstack(this.options) && isMobile) {
      return true;
    }

    return false;
  }
}

class NightwatchClient extends EventEmitter {

  static create(settings, argv) {
    const client = new NightwatchClient(settings, argv);

    if (!client.settings.disable_global_apis) {
      Object.defineProperty(global, 'browser', {
        configurable: true,
        get: function() {
          if (client) {
            return client.api;
          }

          return null;
        }
      });
    }

    return client;
  }

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

    this.__transport = null;
    this.createCommandQueue();

    this.__elementLocator = new Locator(this);
    this.__reporter = {
      logFailedAssertion(err) {
      },
      registerTestError(err) {
        Logger.error(err);
      }
    };

    this.__overridableCommands = new Set();

    this.__api = new NightwatchAPI(this.sessionId, this.settings);

    this.__api.createElement = (locator, options = {}) => {
      return ElementGlobal.element({locator, client: this, options});
    };

    this
      .setLaunchUrl()
      .setScreenshotOptions()
      .setConfigLocateStrategy()
      .setLocateStrategy()
      .setSessionOptions()
      .createApis();
  }

  get overridableCommands() {
    return this.__overridableCommands;
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

  get usingCucumber() {
    if (!this.settings.test_runner) {
      return false;
    }

    return this.settings.test_runner.type === 'cucumber';
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
          const lastArg = args[args.length-1];
          const isLastArgFunction = Utils.isFunction(lastArg);

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
                if (result && result.error && ((result.error instanceof TypeError) || (result.error instanceof SyntaxError))) {
                  throw result.error;
                }
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
            const result = Object.keys(target).reduce((prev, key) => {
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
    return isObject(this.settings.screenshots) ? (this.settings.screenshots && this.options.screenshots.enabled === true) : false;
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

  createApis() {
    this.setApiProperty('page', {});
    this.setApiProperty('assert', {});
    this.setApiProperty('verify', {});

    if (!this.unitTestingMode) {
      this.setApiProperty('ensure', {});
      this.setApiProperty('chrome', {});
      this.setApiProperty('firefox', {});
    }

    Object.defineProperty(this.__api, 'driver', {
      configurable: true,
      enumerable: true,
      get: function() {
        return this.transport && this.transport.driver;
      }.bind(this)
    });

    this.setApiMethod('actions', (opts) => {
      return this.transport.driver.actions(opts);
    });
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
      const namespace = typeof args[0] == 'string' ? context[args[0]] : args[0];
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
    let value = this.settings.baseUrl || this.settings.launchUrl || this.settings.launch_url || null;

    // For e2e and component testing on android emulator
    if (value && !this.settings.desiredCapabilities.real_mobile && this.settings.desiredCapabilities.avd) {         
      value = value.replace('localhost', '10.0.2.2').replace('127.0.0.1', '10.0.2.2');
    }

    this
      .setApiProperty('baseUrl', value)
      .setApiProperty('launchUrl', value)
      .setApiProperty('launch_url', value);

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

  get initialCapabilities() {
    if (isObject(this.settings.capabilities) && Object.keys(this.settings.capabilities).length > 0) {
      return this.settings.capabilities;
    }

    return this.settings.desiredCapabilities;
  }

  setInitialCapabilities(value) {
    if (isObject(this.settings.capabilities) && Object.keys(this.settings.capabilities).length > 0) {
      this.settings.capabilities = value;
    } else {
      this.settings.desiredCapabilities = value;
    }
  }

  setSessionOptions() {
    this.setApiOption('desiredCapabilities', this.initialCapabilities);

    return this;
  }

  mergeCapabilities(props = {}) {
    if (isFunction(props)) {
      this.setInitialCapabilities(props);

      return;
    }

    Object.assign(this.initialCapabilities, props);
    this.setSessionOptions();
  }

  setHttpOptions() {
    this.settings.webdriver = this.settings.webdriver || {};

    if (isUndefined(this.settings.webdriver.port)) {
      this.settings.webdriver.port = this.transport.defaultPort;
    }

    if (isUndefined(this.settings.webdriver.default_path_prefix)) {
      this.settings.webdriver.default_path_prefix = this.transport.defaultPathPrefix;
    }

    if (this.settings.testWorkersEnabled && this.settings.webdriver.start_process) {
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

  async initialize() {
    this.loadKeyCodes();

    return this.loadNightwatchApis();
  }

  setCurrentTest() {
    this.setApiProperty('currentTest', () => this.reporter.currentTest);

    return this;
  }

  loadKeyCodes() {
    this.setApiProperty('Keys', Key);

    return this;
  }

  async loadNightwatchApis() {
    await ApiLoader.init(this);

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
    this.setHttpOptions();

    return this;
  }

  createCommandQueue() {
    const {type: runner} = this.settings.test_runner;

    this.__commandQueue = new CommandQueue({
      compatMode: this.settings.backwards_compatibility_mode,
      foreignRunner: runner !== 'default',
      mochaRunner: runner === 'mocha',
      cucumberRunner: runner === 'cucumber'
    });
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Session
  //////////////////////////////////////////////////////////////////////////////////////////
  /**
   * @return {Promise}
   */
  createSession({argv, moduleKey = '', reuseBrowser = false} = {}) {
    if (!this.startSessionEnabled) {
      return Promise.resolve();
    }

    return this.transport.createSession({argv, moduleKey, reuseBrowser})
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

module.exports = NightwatchClient;
