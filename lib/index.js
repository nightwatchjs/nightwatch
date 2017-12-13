const EventEmitter = require('events');
const HttpRequest = require('./http/request.js');
const HttpOptions = require('./http/options.js').HttpOptions;
const Session = require('./core/session.js');
const SeleniumProtocol = require('./protocol/selenium.js');
const Logger = require('./util/logger.js');
const LocateStrategy = require('./util/locatestrategy.js');
const ApiLoader = require('./api-loader/api.js');

const DEFAULT_CAPABILITIES = {
  browserName: 'firefox',
  javascriptEnabled: true,
  acceptSslCerts: true,
  platform: 'ANY'
};

class Nightwatch extends EventEmitter {

  constructor(opts = {}) {
    super();

    this.setMaxListeners(0);
    this.options = opts;

    this.__locateStrategy = null;
    this.__httpOpts = new HttpOptions();
    this.__session = new Session(this.options);
    this.__transport = new SeleniumProtocol(this);

    this.__api = {
      capabilities : {},
      desiredCapabilities: null,
      sessionId : null,
      options: {}
    };

    this
      .setLaunchUrl()
      .setGlobals()
      .setScreenshotOptions()
      .setLocateStrategy()
      .setLoggingOptions()
      .setSessionOptions()
      .setCapabilities()
      .initTransport()
      .setHttpOptions();

    this.initialize();
  }

  get api() {
    return this.__api;
  }

  get options() {
    return this.__options;
  }

  get locateStrategy() {
    return this.__locateStrategy;
  }

  get session() {
    return this.__session;
  }

  get transport() {
    return this.__transport;
  }

  get httpOpts() {
    return this.__httpOpts;
  }

  get startSessionEnabled() {
    return this.options.start_session;
  }

  /**
   * @deprecated
   */
  get client() {
    return {
      options: this.options,
      api: this.api,
      locateStrategy: this.locateStrategy
    }
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
   * @return {Nightwatch}
   */
  setApiMethod(key, ...args) {
    let fn;
    let namespace = this.__api;

    if (args.length === 1) {
      fn = args[0];
    } else if (args.length === 2) {
      namespace = typeof args[0] == 'string' ? namespace[args[0]] : args[0];
      namespace = namespace || {};

      fn = args[1];
    }

    if (!fn) {
      throw new Error('Method must be a declared.');
    }

    namespace[key] = fn;

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

  //////////////////////////////////////////////////////////////////////////////////////////
  // Options
  //////////////////////////////////////////////////////////////////////////////////////////
  /**
   * @param {object} opts
   */
  set options(opts) {
    this.__options = Object.assign({}, opts);
  }

  shouldPersistGlobals() {
    return this.options.globals && typeof this.options.globals == 'object' && this.options.persist_globals === true;
  }

  /**
   * @deprecated
   */
  endSessionOnFail(val) {
    if (arguments.length === 0) {
      return this.options.end_session_on_fail;
    }

    this.options.end_session_on_fail = val;
  }

  setGlobals() {
    if (this.shouldPersistGlobals()) {
      this.setApiProperty('globals', Object.assign({}, this.options.globals));
    }

    return this;
  }

  setLaunchUrl() {
    let value = this.options.launchUrl || this.options.launch_url || null;
    this.setApiProperty('launchUrl', value).setApiProperty('launch_url', value);

    return this;
  }

  setScreenshotOptions() {
    let screenshots = this.options.screenshots;
    let screenshotsEnabled = screenshots && screenshots.enabled === true || false;

    if (screenshotsEnabled) {
      if (typeof screenshots.path == 'undefined') {
        throw new Error('Please specify the screenshots.path in nightwatch.json.');
      }

      this.options.screenshots.on_error = this.options.screenshots.on_error || typeof this.options.screenshots.on_error == 'undefined';
      this.options.screenshotsPath = screenshots.path;

      this.setApiProperty('screenshotsPath', screenshots.path)
          .setApiOption('screenshotsPath', screenshots.path);
    } else {
      this.options.screenshots = {
        enabled : false,
        path : ''
      };
    }

    let log_screenshot_data = this.options.log_screenshot_data || typeof this.options.log_screenshot_data == 'undefined';
    this.setApiOption('log_screenshot_data', log_screenshot_data);
    this.setApiOption('screenshots', screenshotsEnabled && this.options.screenshots);

    return this;
  }

  setLocateStrategy() {
    this.__locateStrategy = this.options.use_xpath ? LocateStrategy.XPATH : LocateStrategy.CSS_SELECTOR;

    return this;
  }

  setLoggingOptions() {
    if (typeof this.options.output !== 'undefined') {
      Logger.setOutputEnabled(this.options.output);
    }

    if (typeof this.options.detailed_output !== 'undefined') {
      Logger.setDetailedOutput(this.options.detailed_output);
    }

    if (this.options.silent) {
      Logger.disable();
    } else {
      Logger.enable();
    }

    return this;
  }

  setSessionOptions() {
    this.options.start_session = this.options.start_session || typeof this.options.start_session == 'undefined';
    this.options.end_session_on_fail = typeof this.options.end_session_on_fail == 'undefined' || this.options.end_session_on_fail;

    let skip_testcases_on_fail = this.options.skip_testcases_on_fail ||
      typeof this.options.skip_testcases_on_fail == 'undefined' && this.options.start_session; // on by default for UI tests

    this.setApiOption('skip_testcases_on_fail', skip_testcases_on_fail);

    return this;
  }

  setHttpOptions() {
    this
      .setWebdriverHttpOption('host', ['seleniumHost', 'selenium_host'], {allowEmpty: true, defaultValue: 'localhost'})
      .setWebdriverHttpOption('port', ['seleniumPort', 'selenium_port'], {allowEmpty: true, defaultValue: this.transport.defaultPort})
      .setWebdriverHttpOption('ssl', ['useSsl', 'use_ssl'], {defaultValue: false})
      .setWebdriverHttpOption('proxy')
      .setWebdriverHttpOption('timeout_options', 'request_timeout_options')
      .setWebdriverHttpOption('default_path_prefix', 'default_path_prefix', {allowEmpty: true, defaultValue: this.transport.defaultPathPrefix})
      .setWebdriverHttpOption('username')
      .setWebdriverHttpOption('access_key', ['accessKey', 'access_key', 'password'], {allowEmpty: true});

    let webdriverOpts = this.options.webdriver || {};
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

    if (timeoutOptions.timeout !== undefined) {
      this.httpOpts.setTimeout(timeoutOptions.timeout);
    }

    if (timeoutOptions.retry_attempts !== undefined) {
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
    let webdriverOpts = this.options.webdriver = this.options.webdriver || {};

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
      let isDefined = opts.allowEmpty ? typeof this.options[item] != 'undefined' : !!this.options[item];
      if (isDefined) {
        webdriverOpts[newSetting] = this.options[item];
        return this;
      }
    }

    if (typeof opts.defaultValue != 'undefined' && typeof webdriverOpts[newSetting] == 'undefined') {
      webdriverOpts[newSetting] = opts.defaultValue;
    }

    return this;
  }

  setCapabilities() {
    this.desiredCapabilities = Object.assign({}, DEFAULT_CAPABILITIES);

    if (this.options.desiredCapabilities) {
      Object.assign(this.desiredCapabilities, this.options.desiredCapabilities);
    }

    this.setApiOption('desiredCapabilities', this.desiredCapabilities);

    return this;
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Initialize the APIs
  //////////////////////////////////////////////////////////////////////////////////////////

  initialize() {
    this
      .loadKeyCodes()
      .loadNightwatchApis()
  }

  loadKeyCodes() {
    this.setApiProperty('Keys', require('./util/keys.json'));

    return this;
  }

  loadNightwatchApis() {
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

  startSession() {
    return this.session
      .on('session:error', (message, data) => {
        this.emit('nightwatch:session.error', message, data);
      })
      .on('session:finished', _ => {
        this.emit('nightwatch:session.finished');
      })
      .on('session:finished', _=> {
        this.setApiProperty('sessionId', null);
      })
      .on('session:create', data => {
        this.setApiProperty('sessionId', this.session.sessionId);
        this.setApiProperty('capabilities', this.session.capabilities);

        this.emit('nightwatch:session.create', data);
      }).start();
  }

  terminate() {
    this.session.terminateSession();

    return this;
  }
}


module.exports.client = function(options) {
  return new Nightwatch(options);
};

module.exports.cli = function(runTests) {
  const cli = require('./runner/cli/cli.js');
  cli.setup();

  let argv = cli.init();
  if (argv.help) {
    cli.showHelp();
  } else if (argv.version) {
    let packageConfig = require(__dirname + '/../package.json');
    console.log(packageConfig.name + ' v' + packageConfig.version);
  } else {
    if (typeof runTests != 'function') {
      throw new Error('Supplied argument needs to be a function!');
    }
    runTests(argv);
  }
};

module.exports.runner = function(argv, done, settings) {
  const runner = exports.CliRunner(argv);

  return runner.setup(settings, done).runTests(done);
};

module.exports.CliRunner = function(argv) {
  const CliRunner = require('./runner/cli/clirunner.js');

  return new CliRunner(argv);
};

module.exports.initClient = function(opts) {
  const Manager = require('./runner/clientmanager.js');
  const instance = new Manager();

  return instance.init(opts);
};
