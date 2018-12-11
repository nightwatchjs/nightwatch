const Utils = require('../../util/utils.js');
const BaseWDServer = require('./base-wd-server.js');

class SafariDriver extends BaseWDServer {
  static get supportsConcurrency() {
    return true;
  }

  static get acceptedCLIArgs() {
    return [
      'port', 'p', 'enable', 'legacy', 'w3c'
    ];
  }

  static get useLegacyDriver() {
    return true;
  }

  static get serviceName() {
    return 'SafariDriver';
  }

  static get safariDriverPath() {
    return '/usr/bin/safaridriver';
  }

  get initialCheckProcessDelay() {
    return 500;
  }

  get outputFile() {
    return 'safaridriver.log';
  }

  get defaultPort() {
    return 4445;
  }

  get serviceDownloadUrl() {
    return 'https://developer.apple.com/documentation/webkit/macos_webdriver_commands_for_safari_12_and_later';
  }

  get serviceName() {
    return SafariDriver.serviceName;
  }

  constructor(settings) {
    settings.server_path = settings.server_path || SafariDriver.safariDriverPath;

    super(settings);

    const cliArgs = ['--port', this.settings.port];
    if (Utils.isObject(this.settings.cli_args)) {
      Object.keys(this.settings.cli_args).forEach(key => {
        if (SafariDriver.acceptedCLIArgs.includes(key) && this.settings.cli_args[key]) {
          cliArgs.push(`--${key}`, `${this.settings.cli_args[key]}`);
        }
      });
    } else if (Array.isArray(this.settings.cli_args)) {
      // making sure the cli_args doesn't contain spaces
      const argsReduced = this.settings.cli_args.reduce((prev, item) => {
        let values = item.split(/\s+/);
        prev.push(...values);

        return prev;
      }, []);

      cliArgs.push(...argsReduced);
    }

    const use_legacy_jsonwire = this.settings.use_legacy_jsonwire === undefined ?
      SafariDriver.useLegacyDriver : this.settings.use_legacy_jsonwire;

    if (use_legacy_jsonwire) {
      cliArgs.push('--legacy');
    } else {
      cliArgs.push('--w3c');
    }

    this.settings.cli_args = cliArgs;

    // safaridriver doesn't output anything to stdout, so we need to start the process check
    this.statusCheckEndpoint = '';
    this.checkProcessStarted();
  }
}

module.exports = SafariDriver;