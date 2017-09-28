const events = require('events');

const HttpRequest = require('./http/request.js');
const Session = require('./protocol/session.js');
const Logger = require('./util/logger.js');
const LocateStrategy = require('./util/locatestrategy.js');

const DEFAULT_CAPABILITIES = {
  browserName: 'firefox',
  javascriptEnabled: true,
  acceptSslCerts: true,
  platform: 'ANY'
};

class Nightwatch extends events.EventEmitter {

  constructor(opts = {}) {
    super();

    this.sessionId = null;
    this.locateStrategy = null;
    this.terminated = false;

    this.api = {
      capabilities : {},
      sessionId : null,
      options: {}
    };

    this.setOptions(opts);
    this.setMaxListeners(0);
    this.session = new Session(this.options);
  }

  /**
   * @param {object} opts
   * @return {Nightwatch}
   */
  setOptions(opts = {}) {
    this.options = Object.assign({}, opts);

    this
      .setLaunchUrl()
      .setGlobals()
      .setScreenshotOptions()
      .setLocateStrategy()
      .setLoggingOptions()
      .setSessionOptions()
      .setHttpOptions()
      .setCapabilities()
      .loadKeyCodes();

    return this;
  }

  shouldPersistGlobals(opts) {
    return opts.globals && typeof opts.globals == 'object' && opts.persist_globals === true;
  }

  setGlobals(opts = {}) {
    if (this.shouldPersistGlobals()) {
      this.api.globals = Object.assign({}, this.options.globals);
    }
    return this;
  }

  setLaunchUrl() {
    this.api.launchUrl = this.api.launch_url = this.options.launchUrl || this.options..launch_url || null;
    return this;
  }

  setScreenshotOptions() {
    let screenshots = this.options.screenshots;
    let screenshotsEnabled = screenshots && screenshots.enabled === true || false;

    this.api.options.screenshots = screenshotsEnabled;

    if (screenshotsEnabled) {
      if (typeof screenshots.path == 'undefined') {
        throw new Error('Please specify the screenshots.path in nightwatch.json.');
      }

      this.options.screenshots.on_error = this.options.screenshots.on_error || typeof this.options.screenshots.on_error == 'undefined';
      this.api.screenshotsPath = this.api.options.screenshotsPath = screenshots.path;
    } else {
      this.options.screenshots = {
        enabled : false,
        path : ''
      };
    }

    this.api.options.log_screenshot_data = this.options.log_screenshot_data || typeof this.options.log_screenshot_data == 'undefined';

    return this;
  }

  setLocateStrategy() {
    this.locateStrategy = this.options.use_xpath ? LocateStrategy.XPATH : LocateStrategy.CSS_SELECTOR;

    return this;
  }

  setLoggingOptions() {
    if (this.options.silent) {
      Logger.disable();
    } else {
      Logger.enable();
    }

    return this;
  }

  setSessionOptions() {
    this.options.start_session = this.options.start_session || typeof this.options.start_session == 'undefined';

    this.api.options.skip_testcases_on_fail = this.options.skip_testcases_on_fail ||
      typeof this.options.skip_testcases_on_fail == 'undefined' && this.options.start_session; // on by default for UI tests

    this.options.end_session_on_fail = typeof this.options.end_session_on_fail == 'undefined' || this.options.end_session_on_fail;

    return this;
  }

  setHttpOptions() {
    this
      .setWebdriverHttpOption('host', ['seleniumHost', 'selenium_host'], {allowEmpty: true, defaultValue: 'localhost'})
      .setWebdriverHttpOption('port', ['seleniumPort', 'selenium_port'], {allowEmpty: true, defaultValue: 4444})
      .setWebdriverHttpOption('ssl', ['useSsl', 'use_ssl'], {defaultValue: false})
      .setWebdriverHttpOption('proxy')
      .setWebdriverHttpOption('timeout_options', 'request_timeout_options')
      .setWebdriverHttpOption('default_path_prefix', 'default_path_prefix')
      .setWebdriverHttpOption('username')
      .setWebdriverHttpOption('access_key', ['accessKey', 'access_key', 'password'], {allowEmpty: true});

    let webdriverOpts = this.options.webdriver;
    let timeoutOptions = webdriverOpts.request_timeout_options || {};

    if (webdriverOpts.port) {
      HttpRequest.setSeleniumPort(webdriverOpts.port);
    }
    if (webdriverOpts.host) {
      HttpRequest.setSeleniumHost(webdriverOpts.host);
    }

    HttpRequest.useSSL(webdriverOpts.ssl);

    if (webdriverOpts.proxy !== undefined) {
      HttpRequest.setProxy(webdriverOpts.proxy);
    }

    if (timeoutOptions.timeout !== undefined) {
      HttpRequest.setTimeout(timeoutOptions.timeout);
    }
    if (timeoutOptions.retry_attempts !== undefined) {
      HttpRequest.setRetryAttempts(timeoutOptions.retry_attempts);
    }

    if (typeof webdriverOpts.default_path_prefix == 'string') {
      HttpRequest.setDefaultPathPrefix(webdriverOpts.default_path_prefix);
    }

    if (webdriverOpts.username) {
      this.api.options.username = webdriverOpts.username;
      this.api.options.accessKey = webdriverOpts.access_key;

      HttpRequest.setCredentials({
        username : webdriverOpts.username,
        key : webdriverOpts.access_key
      });
    }
  }

  setWebdriverHttpOption(newSetting, oldSetting, opts = {}) {
    let webdriverOpts = this.options.webdriver || {};

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
    this.api.options.desiredCapabilities = this.desiredCapabilities = Object.assign({}, DEFAULT_CAPABILITIES);

    if (this.options.desiredCapabilities) {
      Object.assign(this.desiredCapabilities, this.options.desiredCapabilities);
    }

    return this;
  }

  loadKeyCodes() {
    this.api.Keys = require('./util/keys.json');
    return this;
  }

  start() {

  }
}


exports = module.exports = {};

exports.client = function(options) {
  return new Nightwatch(options);
};

exports.cli = function(runTests) {
  var cli = require('./runner/cli/cli.js');
  cli.setup();

  var argv = cli.init();
  if (argv.help) {
    cli.showHelp();
  } else if (argv.version) {
    var packageConfig = require(__dirname + '/../package.json');
    console.log(packageConfig.name + ' v' + packageConfig.version);
  } else {
    if (typeof runTests != 'function') {
      throw new Error('Supplied argument needs to be a function!');
    }
    runTests(argv);
  }
};

exports.runner = function(argv, done, settings) {
  var runner = exports.CliRunner(argv);
  return runner.setup(settings, done).runTests(done);
};

exports.CliRunner = function(argv) {
  var CliRunner = require('./runner/cli/clirunner.js');
  return new CliRunner(argv);
};

exports.initClient = function(opts) {
  var Manager = require('./runner/clientmanager.js');
  var instance = new Manager();
  return instance.init(opts);
};
