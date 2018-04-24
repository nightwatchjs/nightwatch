const EventEmitter = require('events');
const defaultsDeep = require('lodash.defaultsdeep');
const lodashMerge = require('lodash.merge');

const HttpRequest = require('./http/request.js');
const HttpOptions = require('./http/options.js').HttpOptions;
const Session = require('./core/session.js');
const Logger = require('./util/logger.js');
const Settings = require('./settings/settings.js');
const Transport = require('./protocol/transport.js');
const LocateStrategy = require('./util/locatestrategy.js');
const ApiLoader = require('./api-loader/api.js');

class NightwatchClient extends EventEmitter {

  constructor(settings = {}) {
    super();

    this.setMaxListeners(0);

    this.settings = settings;
    Settings.setDefaults(this.settings);

    // backwards compatibility
    this.options = settings;

    this.__locateStrategy = null;
    this.__httpOpts = new HttpOptions();
    this.__session = new Session(settings);
    this.__transport = Transport.create(this);
    this.__reporter = null;

    this.__api = {
      capabilities : {},
      desiredCapabilities: null,
      sessionId : this.sessionId,
      options: settings,
      globals: settings.globals
    };

    this
      .setLaunchUrl()
      .setGlobals()
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
    return typeof this.settings.screenshots == 'object' ? this.settings.screenshots && this.options.screenshots.enabled === true : false
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
  shouldPersistGlobals() {
    return this.settings.persist_globals === true;
  }

  /**
   * @deprecated
   */
  endSessionOnFail(val) {
    if (arguments.length === 0) {
      return this.settings.end_session_on_fail;
    }

    this.settings.end_session_on_fail = val;
  }

  setGlobals() {
    if (this.shouldPersistGlobals()) {
      this.setApiProperty('globals', this.settings.globals);
    }

    return this;
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
      .setWebdriverHttpOption('host', ['seleniumHost', 'selenium_host'], {allowEmpty: true, defaultValue: 'localhost'})
      .setWebdriverHttpOption('port', ['seleniumPort', 'selenium_port'], {allowEmpty: true, defaultValue: this.transport.defaultPort})
      .setWebdriverHttpOption('ssl', ['useSsl', 'use_ssl'], {defaultValue: false})
      .setWebdriverHttpOption('proxy')
      .setWebdriverHttpOption('timeout_options', 'request_timeout_options')
      .setWebdriverHttpOption('default_path_prefix', 'default_path_prefix', {allowEmpty: true, defaultValue: this.transport.defaultPathPrefix})
      .setWebdriverHttpOption('username')
      .setWebdriverHttpOption('access_key', ['accessKey', 'access_key', 'password'], {allowEmpty: true});

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

    let isDefined = opts.allowEmpty ? typeof webdriverOpts[newSetting] != 'undefined' : !!webdriverOpts[newSetting];
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
      let isDefined = opts.allowEmpty ? typeof this.settings[item] != 'undefined' : !!this.settings[item];
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

        Logger.info(`Received session with ID: ${data.sessionId}`);

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
 * @param argv
 * @param done
 * @param settings
 * @return {*|CliRunner}
 */
Nightwatch.runner = function(argv = {}, done, settings) {
  const runner = Nightwatch.CliRunner(argv);

  return runner.setup(settings).runTests(done);
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
