const path = require('path');
const fs = require('fs');
const boxen = require('boxen');
const {execSync} = require('child_process');
const PackageJson = require('@npmcli/package-json');
const cliProgress = require('cli-progress');
const {DownloaderHelper}= require('node-downloader-helper');
const {Logger, copy} = require('../../lib/utils');
const {colors} = Logger;

const DEFAULT_FOLDER = 'nightwatch';
const EXAMPLE_TEST_FOLDER = 'examples';
const DOWNLOADS = {
  'wikipedia': {
    'android': 'https://raw.githubusercontent.com/priyansh3133/wikipedia/main/wikipedia.apk',
    'ios': 'https://raw.githubusercontent.com/priyansh3133/wikipedia/main/wikipedia.zip'
  }
};

class NightwatchTooling {
  constructor(pkgJsonPath = './') {
    this.pkgJson = new PackageJson(pkgJsonPath);
    this.advice = [];
  }

  async updatePackageJson() {
    // Load changes in package json cause due to npm install
    await this.pkgJson.load();

    this.pkgJson.update({
      nightwatch: this.nightwatchConfig
    });

    await this.pkgJson.save();
  }

  async addComponents(argv) {
    try {
      await this.pkgJson.load();
      this.nightwatchConfig = this.pkgJson.content.nightwatch || {};
  
      this.nightwatchConfig.plugins = this.nightwatchConfig.plugins || [];
      this.rootDir = path.resolve('./');
  
      switch (argv.add) {
        case 'component-testing':
          await this.addComponentTesting();
          break;
  
        case 'vrt':
          await this.addVrt();
          break;
  
        case 'mobile':
        case 'mobile-testing':
          await this.addMobileTesting();
          break;
  
        case 'unit-testing':
        case 'api-testing':
          await this.addAPITesting();
          break;
  
        default:
          this.printHelp();
      }
  
      await this.updatePackageJson();
      this.printAdvice();
    } catch (err) {
      // TODO: add better error log
      Logger.error(err);
    }
  }

  addComponentTestingConfig(answers) {
    if (answers.uiFramework === 'react') {
      const componentConfigPath = path.join(__dirname, 'assets', 'component-config');
      const nightwatchPath = path.join(this.rootDir, DEFAULT_FOLDER);

      try {
        fs.mkdirSync(nightwatchPath);
        // eslint-disable-next-line
      } catch (err) {}

      // Generate a new index.jsx file
      const reactIndexSrcPath = path.join(componentConfigPath, 'index.jsx');
      const reactIndexDestPath = path.join(nightwatchPath, 'index.jsx');

      fs.copyFileSync(reactIndexSrcPath, reactIndexDestPath);
    }

    if (answers.uiFramework === 'react' || answers.uiFramework === 'vue') {
      this.nightwatchConfig.vite_dev_server = {
        start_vite: true,
        port: 5173
      };

      this.nightwatchConfig.baseUrl = 'http://localhost:5173';
    }

    if (answers.uiFramework === 'storybook') {
      this.nightwatchConfig['@nightwatch/storybook'] = {
        start_storybook: true,
        storybook_config_dir: '.storybook',
        hide_csf_errors: true,
        show_browser_console: true,
        storybook_url: 'http://localhost:6006'
      };

      this.nightwatchConfig.baseUrl = 'http://localhost:6006';
    }
  }

  async addComponentTesting() {
    const {default: {prompt}} = await import('inquirer');

    Logger.info('Setting up Component Testing for Nightwatch...');

    const answers = await prompt([
      {
        type: 'list',
        name: 'uiFramework',
        message: 'Select UI framework',
        choices: [
          {name: 'React', value: 'react'},
          {name: 'Vue.js', value: 'vue'},
          {name: 'Storybook', value: 'storybook'}
        ]
      }
    ]);

    const pluginInstall = `@nightwatch/${answers.uiFramework}`;
    if (!this.nightwatchConfig.plugins.includes(pluginInstall)) {
      this.nightwatchConfig.plugins.push(pluginInstall);
      this.installPackages([pluginInstall]);
      this.addComponentTestingConfig(answers);
    } else {
      Logger.info('Component Testing is already setup, updating packages...');
      // TODO: update package and config
    }
  }

  async addVrt() {
    Logger.info('Setting up Visual Regression Testing for Nightwatch...');
    if (!this.nightwatchConfig.plugins.includes('@nightwatch/vrt')) {
      this.nightwatchConfig.plugins.push('@nightwatch/vrt');
      this.installPackages(['@nightwatch/vrt']);
    } else {
      Logger.info('Visual Regression Testing is already setup, updating packages...');
      // TODO: update package
    }
  }

  async addAPITesting() {
    Logger.info('Setting up Unit Testing for Nightwatch...');
    if (!this.nightwatchConfig.plugins.includes('@nightwatch/apitesting')) {
      const packages = ['@nightwatch/apitesting'];
      this.nightwatchConfig.plugins.push('@nightwatch/apitesting');

      if (!this.nightwatchConfig.plugins.includes('@nightwatch/testdoubles')) {
        packages.push('@nightwatch/testdoubles');
        this.nightwatchConfig.plugins.push('@nightwatch/testdoubles');
      } else {
        // TODO: update packages
      }

      this.installPackages(packages);

      this.advice.push(`Make sure browser session is turned off during API testing: 
      {
        "start_session": false,
        "webdriver": {
          "start_process": false
        }
      }
    `);
    } else {
      Logger.info('Unit Testing is already setup, updating packages...');
      // TODO: update package
    }
  }

  getMobileTestingQuestions() {
    return [
      {
        type: 'list',
        name: 'mobilePlatform',
        message: 'Select target mobile platform(s)',
        choices: () => {
          const platforms =   [{name: 'Android', value: 'android'}];

          if (process.platform === 'darwin') {
            platforms.push(
              {name: 'iOS', value: 'ios'},
              {name: 'Both', value: 'both'});
          }

          return platforms;
        }
      },
      {
        type: 'checkbox',
        name: 'mobileBrowsers',
        message: 'Select target mobile-browsers',
        choices: () => {
          const devices = [
            {name: 'Chrome (Android)', value: 'chrome'},
            {name: 'Firefox (Android)', value: 'firefox'}
          ];

          if (process.platform === 'darwin') {
            devices.push({name: 'Safari (iOS)', value: 'safari'});
          }

          return devices;
        },
        default: ['chrome'],
        validate: (value) => {
          return !!value.length || 'Please select at least 1 browser.';
        }
      }
    ];
  }

  addMobileTestingConfig(answers) {
    this.nightwatchConfig.test_settings = this.nightwatchConfig.test_settings || {};

    if (answers.mobileBrowsers.includes('firefox')) {
      this.nightwatchConfig.test_settings['android.real.firefox'] = {
        desiredCapabilities: {
          real_mobile: true,
          browserName: 'firefox',
          acceptInsecureCerts: true,
          'moz:firefoxOptions': {
            args: [],
            androidPackage: 'org.mozilla.firefox'
          }
        },
        webdriver: {
          start_process: true,
          server_path: ''
        }
      };

      this.nightwatchConfig.test_settings['android.emulator.firefox'] = {
        desiredCapabilities: {
          real_mobile: false,
          avd: 'nightwatch-android-11',
          browserName: 'firefox',
          acceptInsecureCerts: true,
          'moz:firefoxOptions': {
            args: [],
            androidPackage: 'org.mozilla.firefox'
          }
        },
        webdriver: {
          start_process: true,
          server_path: '',
          cli_args: []
        }
      };
    };

    if (answers.mobileBrowsers.includes('chrome')) {
      this.nightwatchConfig.test_settings['android.real.chrome'] = {
        desiredCapabilities: {
          real_mobile: true,
          browserName: 'chrome',
          'goog:chromeOptions': {
            w3c: true,
            args: [],
            androidPackage: 'com.android.chrome'
          }
        },

        webdriver: {
          start_process: true,
          server_path: '',
          cli_args: []
        }
      };

      this.nightwatchConfig.test_settings['android.emulator.chrome'] = {
        desiredCapabilities: {
          real_mobile: false,
          avd: 'nightwatch-android-11',
          browserName: 'chrome',
          'goog:chromeOptions': {
            w3c: true,
            args: [],
            androidPackage: 'com.android.chrome'
          }
        },

        webdriver: {
          start_process: true,
          // path to chromedriver executable which can work with the factory
          // version of Chrome mobile browser on the emulator (version 83).
          server_path: 'chromedriver-mobile/chromedriver<%- dotExe %>',
          cli_args: [
            // --verbose
          ]
        }
      };
    };

    if (answers.mobileBrowsers.includes('safari')) {
      this.nightwatchConfig.test_settings['ios.real.safari'] = {
        desiredCapabilities: {
          browserName: 'safari',
          platformName: 'iOS'
        },

        webdriver: {
          start_process: true,
          server_path: '',
          cli_args: []
        }
      };

      this.nightwatchConfig.test_settings['ios.simulator.safari'] = {
        desiredCapabilities: {
          browserName: 'safari',
          platformName: 'iOS',
          'safari:useSimulator': true,
          'safari:deviceName': 'iPhone 13'
        },

        webdriver: {
          start_process: true,
          server_path: '',
          cli_args: []
        }
      };
    };

    if (answers.testingType?.includes('app')) {
      this.nightwatchConfig.test_settings['app'] = {
        selenium: {
          start_process: true,
          use_appium: true,
          host: 'localhost',
          port: 4723,
          server_path: '',
          // args to pass when starting the Appium server
          cli_args: [
          ]
        },
        webdriver: {
          timeout_options: {
            timeout: 150000,
            retry_attempts: 3
          },
          keep_alive: false,
          start_process: false
        }
      };
    };

    if (['android', 'both'].includes(answers.mobilePlatform)) {
      this.nightwatchConfig.test_settings['app.android.emulator'] = {
        extends: 'app',
        'desiredCapabilities': {
          browserName: null,
          platformName: 'android',
          'appium:options': {
            automationName: 'UiAutomator2',
            // Android Virtual Device to run tests on
            avd: 'nightwatch-android-11',
            //TODO: fix this
            app: `${__dirname}/nightwatch/sample-apps/wikipedia.apk`,
            appPackage: 'org.wikipedia',
            appActivity: 'org.wikipedia.main.MainActivity',
            appWaitActivity: 'org.wikipedia.onboarding.InitialOnboardingActivity',
            // TODO: fix this
            chromedriverExecutable: `${__dirname}/chromedriver-mobile/chromedriver<%- dotExe %>`,
            newCommandTimeout: 0
          }
        }
      },

      this.nightwatchConfig.test_settings['app.android.real'] = {
        extends: 'app',
        'desiredCapabilities': {
          // More capabilities can be found at https://github.com/appium/appium-uiautomator2-driver#capabilities
          browserName: null,
          platformName: 'android',
          'appium:options': {
            automationName: 'UiAutomator2',

            // TODO: fix this
            app: `${__dirname}/nightwatch/sample-apps/wikipedia.apk`,
            appPackage: 'org.wikipedia',
            appActivity: 'org.wikipedia.main.MainActivity',
            appWaitActivity: 'org.wikipedia.onboarding.InitialOnboardingActivity',
            chromedriverExecutable: '',
            newCommandTimeout: 0
          }
        }
      };
    };

    if (['ios', 'both'].includes(answers.mobilePlatform)) {
      this.nightwatchConfig.test_settings['app.ios.simulator'] = {
        extends: 'app',
        'desiredCapabilities': {
          // More capabilities can be found at https://github.com/appium/appium-xcuitest-driver#capabilities
          browserName: null,
          platformName: 'ios',
          'appium:options': {
            automationName: 'XCUITest',
            deviceName: 'iPhone 13',

            // TODO: fix this
            app: `${__dirname}/nightwatch/sample-apps/wikipedia.zip`,
            bundleId: 'org.wikimedia.wikipedia',
            newCommandTimeout: 0
          }
        }
      };

      this.nightwatchConfig.test_settings['app.ios.real'] = {
        extends: 'app',
        'desiredCapabilities': {
          browserName: null,
          platformName: 'ios',
          'appium:options': {
            automationName: 'XCUITest',
            //TODO: fix this
            app: `${__dirname}/nightwatch/sample-apps/wikipedia.zip`,
            bundleId: 'org.wikimedia.wikipedia',
            newCommandTimeout: 0
          }
        }
      };
    };
  }

  addMobileTestingAdvice(answers, mobileHelperResult) {
    this.advice.push(colors.green('🚀 RUN MOBILE EXAMPLE TESTS'), '\n');

    const mobileJsExample = `npx nightwatch .${path.sep}${path.join(
      EXAMPLE_TEST_FOLDER,
      'basic',
      'ecosia.js'
    )}`;

    const appJsExample = (envFlag, mobilePlatform) => {
      return `npx nightwatch .${path.sep}${path.join(
        EXAMPLE_TEST_FOLDER,
        'mobile-app-tests',
        `wikipedia-${mobilePlatform}.js`
      )}${envFlag}`;
    };

    if (['android', 'both'].includes(answers.mobilePlatform)) {
      const errorHelp = 'Please go through the setup logs above to know the actual cause of failure.\n\nOr, re-run the following commands:';

      const appiumFlag = ' --appium';
      const setupMsg = `  To setup Android, run: ${colors.dark_gray('npx @nightwatch/mobile-helper android' + appiumFlag)}\n` +
        `  For Android help, run: ${colors.dark_gray('npx @nightwatch/mobile-helper android --help')}`;

      const browsers = answers.mobileBrowsers?.filter((browser) => ['chrome', 'firefox'].includes(browser)) || [];

      const realAndroidTestCommand = (newline = '') => {
        const commands = [];
        commands.push('▶ To run an example test on Real Android device');
        commands.push('  * Make sure your device is connected with USB Debugging turned on.');
        commands.push('  * Make sure required browsers are installed.');

        if (browsers.length) {
          commands.push('  For mobile web tests, run:');
          for (const browser of browsers) {
            const envFlag = ` --env android.real.${browser}`;
            commands.push(`    ${colors.cyan(mobileJsExample + envFlag)}${newline}`);
          }
        }

        commands.push('  For mobile app tests, run:');
        const envFlag = ' --env app.android.real';
        commands.push(`    ${colors.cyan(appJsExample(envFlag, 'android'))}${newline}`);

        return commands.join('\n');
      };

      const emulatorAndroidTestCommand = (newline = '') => {
        const commands = [];
        commands.push('▶ To run an example test on Android Emulator');

        if (browsers.length) {
          commands.push('  For mobile web tests, run:');
          for (const browser of browsers) {
            const envFlag = ` --env android.emulator.${browser}`;
            commands.push(`    ${colors.cyan(mobileJsExample + envFlag)}${newline}`);
          }
        }

        commands.push('  For mobile app tests, run:');
        const envFlag = ' --env app.android.emulator';
        commands.push(`    ${colors.cyan(appJsExample(envFlag, 'android'))}${newline}`);

        return commands.join('\n');
      };

      const testCommands = `Once setup is complete...\n\n${realAndroidTestCommand()}\n\n${emulatorAndroidTestCommand()}`;

      if (!mobileHelperResult.android) {
        // mobileHelperResult.android is undefined or false

        // eslint-disable-next-line no-console
        console.log(
          boxen(`${colors.red(
            'Android setup failed...'
          )}\n\n${errorHelp}\n${setupMsg}\n\n${testCommands}`, {padding: 1})
        );
      } else if (mobileHelperResult.android === true) {
        // do nothing (command passed but verification/setup not initiated)
        // true is returned in cases of --help command.
      } else if (mobileHelperResult.android.status === false) {
        if (mobileHelperResult.android.setup) {
          Logger.error(
            boxen(`${colors.red(
              'Android setup failed...'
            )}\n\n${errorHelp}\n${setupMsg}\n\n${testCommands}`, {padding: 1})
          );
        } else {
          Logger.info(
            boxen(`${colors.red(
              'Android setup skipped...'
            )}\n\n${setupMsg}\n\n${testCommands}`, {padding: 1})
          );
        }
      } else {
        // mobileHelperResult.android.status is true.
        const relativeToRootDir = path.relative(process.cwd(), this.rootDir) || '.';

        if (this.rootDir !== process.cwd()) {
          Logger.info('First, change directory to the root dir of your project:');
          Logger.info(colors.cyan(`  cd ${relativeToRootDir}`), '\n');
        }

        if (['real', 'both'].includes(mobileHelperResult.android.mode)) {
          Logger.info(realAndroidTestCommand(), '\n');
        }

        if (['emulator', 'both'].includes(mobileHelperResult.android.mode)) {
          Logger.info(emulatorAndroidTestCommand(), '\n');
        }
      }
    }

    if (['ios', 'both'].includes(answers.mobilePlatform)) {
      const setupHelp = 'Please follow the guide above to complete the setup.\n\nOr, re-run the following commands:';

      const setupCommand = `  For iOS setup, run: ${colors.dark_gray('npx @nightwatch/mobile-helper ios --setup')}\n` +
        `  For iOS help, run: ${colors.dark_gray('npx @nightwatch/mobile-helper ios --help')}`;

      const safariBrowserPresent = answers.mobileBrowsers?.includes('safari');

      const realIosTestCommand = () => {
        const commands = [];
        commands.push('▶ To run an example test on real iOS device');

        if (safariBrowserPresent) {
          commands.push('  For mobile web tests, run:');
          commands.push(`    ${colors.cyan(mobileJsExample + ' --env ios.real.safari')}`);
        }

        commands.push('  For mobile app tests, run:');
        commands.push(`    ${colors.cyan(appJsExample(' --env app.ios.real', 'ios'))}`);

        return commands.join('\n');
      };

      const simulatorIosTestCommand = () => {
        const commands = [];
        commands.push('▶ To run an example test on iOS simulator');

        if (answers.mobile && safariBrowserPresent) {
          commands.push('  For mobile web tests, run:');
          commands.push(`    ${colors.cyan(mobileJsExample + ' --env ios.simulator.safari')}`);
        }

        commands.push('  For mobile app tests, run:');
        commands.push(`    ${colors.cyan(appJsExample(' --env app.ios.simulator', 'ios'))}`);

        return commands.join('\n');
      };

      const testCommand = `After completing the setup...\n\n${realIosTestCommand()}\n\n${simulatorIosTestCommand()}`;

      if (!mobileHelperResult.ios) {
        Logger.error(
          boxen(`${colors.red(
            'iOS setup failed...'
          )}\n\n${setupCommand}\n\n${testCommand}`, {padding: 1})
        );
      } else if (typeof mobileHelperResult.ios === 'object') {
        if (mobileHelperResult.ios.real) {
          Logger.info(realIosTestCommand(), '\n');
        }

        if (mobileHelperResult.ios.simulator) {
          Logger.info(simulatorIosTestCommand(), '\n');
        }

        if (!mobileHelperResult.ios.real || !mobileHelperResult.ios.simulator) {
          // eslint-disable-next-line no-console
          console.log(
            boxen(`${colors.yellow(
              'iOS setup incomplete...'
            )}\n\n${setupHelp}\n${setupCommand}\n\n${testCommand}`, {padding: 1})
          );
        }
      }
    }
  }

  async copyAppTestingExamples(answers) {
    const lang = answers.language || 'js';

    const mobilePlatforms = [];
    if (answers.mobilePlatform) {
      if (answers.mobilePlatform === 'both') {
        mobilePlatforms.push('android', 'ios');
      } else {
        mobilePlatforms.push(answers.mobilePlatform);
      }
    }

    Logger.info('Generating mobile-app example tests...\n');

    const examplesDestPath = path.join(
      this.rootDir,
      DEFAULT_FOLDER,
      EXAMPLE_TEST_FOLDER,
      'mobile-app-tests'
    );
    const appDestPath = path.join(this.rootDir, DEFAULT_FOLDER, 'sample-apps');

    try {
      fs.mkdirSync(examplesDestPath, {recursive: true});
      fs.mkdirSync(appDestPath, {recursive: true});
      // eslint-disable-next-line
    } catch (err) {}

    for (const platform of mobilePlatforms) {
      const examplesSrcPath = path.join(__dirname, 'assets', 'mobile-app-tests', `${platform}-${lang}`);

      copy(examplesSrcPath, examplesDestPath);

      Logger.info(`Downloading sample ${platform} app...`);
      const downloadUrl = DOWNLOADS.wikipedia[platform];
      const downloaded = await this.downloadWithProgressBar(downloadUrl, appDestPath);
      if (!downloaded) {
        Logger.info(`${colors.red('Download Failed!')} You can download it from ${downloadUrl} and save it to '${path.join(
          DEFAULT_FOLDER, 'sample-apps'
        )}' inside your project root dir.\n`);
      }
    }
  }

  async addMobileTesting() {
    const {default: {prompt}} = await import('inquirer');

    Logger.info('Setting up Component Testing for Nightwatch...');

    const mobileHelperResult = {};
    const answers = await prompt(this.getMobileTestingQuestions());

    this.installPackages(['@nightwatch/mobile-helper', 'appium']);

    // import components form mobile-helper and execute them
    const {AndroidSetup, IosSetup} = require('@nightwatch/mobile-helper');

    if (['android', 'both'].includes(answers.mobilePlatform)) {
      Logger.info('Running Android Setup...\n');
      const androidSetup = new AndroidSetup({
        appium: true
      }, this.rootDir);
      mobileHelperResult.android = await androidSetup.run();
    }

    if (['ios', 'both'].includes(answers.mobilePlatform)) {
      Logger.info('Running iOS Setup...\n');
      const iosSetup = new IosSetup({mode: ['simulator', 'real'], setup: true});
      mobileHelperResult.ios = await iosSetup.run();
    }

    await this.copyAppTestingExamples(answers);
    this.addMobileTestingConfig(answers);
    this.addMobileTestingAdvice(answers, mobileHelperResult);
  }

  printHelp() {
    // TODO: load this from a common place
    const message = `
    Invalid argument passed to ${colors.cyan('--install')}, available options are:
        ${colors.brown('component-testing')}       :: Adds support for component testing using React, Vue, etc.
        ${colors.brown('unit-testing')}            :: Adds support for unit testing / api testing.
        ${colors.brown('vrt')}                     :: Adds support for Visual Regression testing.
        ${colors.brown('mobile-testing')}          :: Sets up tools to run tests on real mobile devices using Nightwatch. 
    `;

    // eslint-disable-next-line no-console
    console.log(message);
  }

  printAdvice() {
    Logger.info(this.advice.join('\n'));
  }

  installPackages(packagesToInstall) {
    if (packagesToInstall.length === 0) {
      return;
    }

    Logger.info('Installing the following packages:');
    for (const pack of packagesToInstall) {
      Logger.info(`- ${pack}`);
    }
    Logger.info();

    for (const pack of packagesToInstall) {
      Logger.info(`Installing ${colors.green(pack)}`);

      try {
        execSync(`npm install ${pack} --save-dev`, {
          stdio: ['inherit', 'pipe', 'inherit'],
          cwd: this.rootDir
        });
        Logger.info(colors.green('Done!'), '\n');
      } catch (err) {
        Logger.error(`Failed to install ${pack}. Please run 'npm install ${pack} --save-dev' later.\n`);
      }
    }
  }

  async downloadWithProgressBar(url, dest) {
    const progressBar = new cliProgress.Bar({
      format: ' [{bar}] {percentage}% | ETA: {eta}s'
    }, cliProgress.Presets.shades_classic);

    const downloader = new DownloaderHelper(url, dest, {override: {skip: true}});

    downloader.on('start', () => progressBar.start(100, 0));
    downloader.on('progress', (stats) => {
      progressBar.update(stats.progress);
    });
    downloader.on('skip', (skipInfo) => {
      progressBar.stop();
      Logger.info(`Download skipped! File already present at: '${skipInfo.filePath}'\n`);
    });
    downloader.on('end', (downloadInfo) => {
      progressBar.stop();
      Logger.info(`${colors.green('Success!')} File downloaded at: '${downloadInfo.filePath}'\n`);
    });
    downloader.on('error', () => progressBar.stop());

    return await downloader.start();
  };
}

module.exports = new NightwatchTooling();