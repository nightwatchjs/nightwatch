const AppiumBaseServer = require('./appiumBase.js');
const AppiumServiceBuilder = require('./service-builders/appium.js');
const {iosRealDeviceUDID} = require('../../utils/mobile.js');


class AppiumServer extends AppiumBaseServer {
  static createService(settings) {
    const Options = require('./options.js');
    const opts = new Options({settings});
    opts.updateWebdriverPath();

    const appiumService = new AppiumServiceBuilder(settings);

    const outputFile = settings.webdriver.log_file_name || '';
    appiumService.setOutputFile(outputFile);

    return appiumService;
  }

  get defaultBrowser() {
    return null;
  }

  get ServiceBuilder() {
    return AppiumServiceBuilder;
  }

  get defaultServerUrl() {
    return 'http://127.0.0.1:4723';
  }

  get defaultPort() {
    return 4723;
  }

  get defaultPathPrefix() {
    return '/wd/hub';
  }

  createSessionOptions(argv) {
    this.extractAppiumOptions();

    // set 'appium:udid' if deviceId present in argv
    if (argv && argv.deviceId) {
      const platformName = this.desiredCapabilities.platformName;

      let udid = argv.deviceId;
      if (platformName && platformName.toLowerCase() === 'ios') {
        udid = iosRealDeviceUDID(udid);
      }

      this.desiredCapabilities['appium:udid'] = udid;
    }

    // if `appium:chromedriverExecutable` is present and left blank,
    // assign the path of binary from `chromedriver` NPM package to it.
    if (this.desiredCapabilities['appium:chromedriverExecutable'] === '') {
      const chromedriver = this.seleniumCapabilities.getChromedriverPath();
      if (chromedriver) {
        this.desiredCapabilities['appium:chromedriverExecutable'] = chromedriver;
      }
    }

    return super.createSessionOptions(argv) || this.desiredCapabilities;
  }

  createDriver({options}) {
    return this.createAppiumDriver({options});
  }
};

module.exports = AppiumServer;
