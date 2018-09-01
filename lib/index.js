const EventEmitter = require('events');
const HttpOptions = require('./http/options.js');
const HttpRequest = require('./http/request.js');
const Session = require('./core/session.js');
const Logger = require('./util/logger.js');
const Settings = require('./settings/settings.js');
const Transport = require('./transport/transport.js');
const LocateStrategy = require('./util/locatestrategy.js');
const ApiLoader = require('./api-loader/api.js');
const Utils = require('./util/utils.js');

class NightwatchAPI {
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

  constructor(settings = {}) {
    super();

    this.setMaxListeners(0);

    this.settings = settings;
    Settings.setDefaults(this.settings);

    // backwards compatibility
    this.options = settings;

    this.__locateStrategy = null;
    this.__httpOpts = HttpOptions.global;
    this.__session = new Session(settings);
    this.__transport = Transport.create(this);
    this.__reporter = null;

    this.__api = new NightwatchAPI(this.sessionId, settings);

    this
      .setLaunchUrl()
      .setScreenshotOptions()
      .setLocateStrategy()
      .setSessionOptions()
      .initTransport()
      .setHttpOptions();
  }

  get api() {
    return this.__api;
  }

  get queue() {
    return this.session.commandQueue;
  }

  get locateStrategy() {
    return this.__locateStrategy;
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

  get httpOpts() {
    return this.__httpOpts;
  }

  get startSessionEnabled() {
    return this.settings.start_session;
  }

  get screenshotsEnabled() {
    return Utils.isObject(this.settings.screenshots) ? this.settings.screenshots && this.options.screenshots.enabled === true : false;
  }

  get reporter() {
    return this.__reporter || {};
  }

  /**
   * @deprecated
   */
  get client() {
    return {
      options: this.settings,
      api: this.api,
      locateStrategy: this.locateStrategy
    };
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Setters
  //////////////////////////////////////////////////////////////////////////////////////////
  setApiProperty(key, value) {
    this.__api[key] = value;

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
    let screenshots = this.settings.screenshots;

    if (this.screenshotsEnabled) {
      if (typeof screenshots.path == 'undefined') {
        throw new Error('Please specify the screenshots.path in nightwatch.json.');
      }

      this.settings.screenshots.on_error = this.settings.screenshots.on_error || typeof this.options.screenshots.on_error == 'undefined';
      this.settings.screenshotsPath = screenshots.path;

      this.setApiProperty('screenshotsPath', screenshots.path)
        .setApiOption('screenshotsPath', screenshots.path);
    } else {
      this.settings.screenshots = {
        enabled : false,
        path : ''
      };
    }

    return this;
  }

  setLocateStrategy(strategy = null) {
    if (strategy && LocateStrategy.isValid(strategy)) {
      this.__locateStrategy = strategy;

      return this;
    }

    this.__locateStrategy = this.settings.use_xpath ? LocateStrategy.XPATH : LocateStrategy.CSS_SELECTOR;

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

    let webdriverOpts = this.settings.webdriver || {};
    let timeoutOptions = webdriverOpts.timeout_options || {};

    if (webdriverOpts.port) {
      this.httpOpts.setPort(webdriverOpts.port);
    }

    if (webdriverOpts.host) {
      this.httpOpts.setHost(webdriverOpts.host);
    }

    this.httpOpts.useSSL(webdriverOpts.ssl);

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
        username : webdriverOpts.username,
        key : webdriverOpts.access_key
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
    this.setApiProperty('currentTest', this.reporter.currentTest);

    return this;
  }

  loadKeyCodes() {
    this.setApiProperty('Keys', require('./util/keys.json'));

    return this;
  }

  loadNightwatchApis() {
    this.setApiProperty('page', {});
    this.setApiProperty('assert', {});

    if (this.startSessionEnabled) {
      this.setApiProperty('verify', {});
    }

    ApiLoader.init(this);

    return this;
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Session
  //////////////////////////////////////////////////////////////////////////////////////////
  initTransport() {
    this.session.setTransportProtocol(this.transport);

    return this;
  }

  /**
   * @return {Promise}
   */
  createSession() {
    if (!this.session.startSessionEnabled) {
      return Promise.resolve();
    }

    this.session.on('session:finished', reason => {
      this.emit('nightwatch:finished', reason);
    });

    return this.session.create()
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

Nightwatch.client = function(settings, reporter = null) {
  const client = new NightwatchClient(settings);

  if (reporter === null) {
    const SimplifiedReporter = require('./core/reporter.js');
    reporter = new SimplifiedReporter(settings);
  }

  client.setReporter(reporter).initialize();

  return client;
};

Nightwatch.cli = function(callback) {
  const Argv = require('./runner/cli/argv-setup.js');
  Argv.setup();

  let argv = Argv.init();

  if (argv.help) {
    Argv.showHelp();
  } else if (argv.version) {
    let packageConfig = require(__dirname + '/../package.json');
    console.log(packageConfig.name + ' v' + packageConfig.version);
  } else {
    if (typeof callback != 'function') {
      throw new Error('Supplied argument needs to be a function.');
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
Nightwatch.runner = function(argv = {}, done, settings) {
  const runner = Nightwatch.CliRunner(argv);

  return runner.setup(settings).runTests(done);
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
