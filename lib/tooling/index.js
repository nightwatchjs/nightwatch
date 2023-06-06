const path = require('path');
const fs = require('fs');
const boxen = require('boxen');
const {execSync} = require('child_process');
const PackageJson = require('@npmcli/package-json');
const {Logger} = require('../../lib/utils');


const DEFAULT_FOLDER = 'nightwatch';

class NightwatchTooling {
  constructor(pkgJsonPath = './') {
    this.pkgJson = new PackageJson(pkgJsonPath);
    this.advice = [];
  }

  async install(argv) {
    await this.pkgJson.load();
    this.nightwatchConfig = this.pkgJson.content.nightwatch || {};

    this.nightwatchConfig.plugins = this.nightwatchConfig.plugins || [];
    this.rootDir = path.resolve('./');

    switch (argv.install) {
      case 'component-testing':
        await this.installComponentTesting();
        break;

      case 'vrt':
        await this.installVrt();
        break;

      case 'mobile':
        await this.installMobileTesting();
        break;

      case 'unit-testing':
      case 'api-testing':
        await this.installAPITesting();
        break;

      default:
        this.printHelp();
    }

    await this.updatePackageJson();
    this.printAdvice();
  }

  async updatePackageJson() {
    // Load changes in package json cause due to npm install
    await this.pkgJson.load();

    this.pkgJson.update({
      nightwatch: this.nightwatchConfig
    });

    await this.pkgJson.save();
  }

  printHelp() {
    const message = `
    Invalid argument passed to ${Logger.colors.cyan('--install')}, available options are:
        ${Logger.colors.brown('component-testing')}       :: Adds support for component testing using React, Vue, etc.
        ${Logger.colors.brown('unit-testing')}            :: Adds support for unit testing / api testing.
        ${Logger.colors.brown('vrt')}                     :: Adds support for Visual Regression testing.
        ${Logger.colors.brown('mobile-testing')}          :: Sets up tools to run tests on real mobile devices using Nightwatch. 
    `;

    // eslint-disable-next-line no-console
    console.log(message);
  }

  async installComponentTesting() {
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
      this.setupComponentTesting(answers);
    } else {
      Logger.info('Component Testing is already setup, updating packages...');
      // TODO: update package and config
    }
  }

  setupComponentTesting(answers) {
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

  async installVrt() {
    Logger.info('Setting up Visual Regression Testing for Nightwatch...');
    if (!this.nightwatchConfig.plugins.includes('@nightwatch/vrt')) {
      this.nightwatchConfig.plugins.push('@nightwatch/vrt');
      this.installPackages(['@nightwatch/vrt']);
    } else {
      Logger.info('Visual Regression Testing is already setup, updating packages...');
      // TODO: update package
    }
  }

  async installAPITesting() {
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

  async installMobileTesting() {
    const {default: {prompt}} = await import('inquirer');

    Logger.info('Setting up Component Testing for Nightwatch...');

    const mobileHelperResult = {};
    const answers = await prompt([
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
      }
    ]);

    // import components form mobile-helper and execute them
    const {AndroidSetup, IosSetup} = require('@nightwatch/mobile-helper');

    // answers.mobilePlatform will be undefined in case of empty or non-matching mobileBrowsers
    // hence, no need to setup any device.
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

    // TODO: add configurations

    Logger.info(Logger.colors.green('🚀 RUN MOBILE EXAMPLE TESTS'), '\n');

    if (['android', 'both'].includes(answers.mobilePlatform)) {
      const errorHelp = 'Please go through the setup logs above to know the actual cause of failure.\n\nOr, re-run the following commands:';

      const appiumFlag = isAppTestingSetup(answers) ? ' --appium' : '';
      const setupMsg = `  To setup Android, run: ${Logger.colors.gray.italic('npx @nightwatch/mobile-helper android' + appiumFlag)}\n` +
        `  For Android help, run: ${Logger.colors.gray.italic('npx @nightwatch/mobile-helper android --help')}`;

      const browsers = answers.mobileBrowsers?.filter((browser) => ['chrome', 'firefox'].includes(browser)) || [];

      const realAndroidTestCommand = (newline = '') => {
        const commands = [];
        commands.push('▶ To run an example test on Real Android device');
        commands.push('  * Make sure your device is connected with USB Debugging turned on.');
        commands.push('  * Make sure required browsers are installed.');

        if (answers.mobile && browsers.length) {
          commands.push('  For mobile web tests, run:');
          for (const browser of browsers) {
            const envFlag = ` --env android.real.${browser}`;
            commands.push(`    ${Logger.colors.cyan(mobileExampleCommand(envFlag))}${newline}`);
          }
        }
        
        if (isAppTestingSetup(answers) && answers.runner !== Runner.Cucumber) {
          commands.push('  For mobile app tests, run:');
          const envFlag = ' --env app.android.real';
          commands.push(`    ${Logger.colors.cyan(appExampleCommand(envFlag, 'android'))}${newline}`);
        }

        return commands.join('\n');
      };

      const emulatorAndroidTestCommand = (newline = '') => {
        const commands = [];
        commands.push('▶ To run an example test on Android Emulator');

        if (answers.mobile && browsers.length) {
          commands.push('  For mobile web tests, run:');
          for (const browser of browsers) {
            const envFlag = ` --env android.emulator.${browser}`;
            commands.push(`    ${Logger.colors.cyan(mobileExampleCommand(envFlag))}${newline}`);
          }
        }

        if (isAppTestingSetup(answers) && answers.runner !== Runner.Cucumber) {
          commands.push('  For mobile app tests, run:');
          const envFlag = ' --env app.android.emulator';
          commands.push(`    ${Logger.colors.cyan(appExampleCommand(envFlag, 'android'))}${newline}`);
        }

        return commands.join('\n');
      };

      const testCommands = `Once setup is complete...\n\n${realAndroidTestCommand()}\n\n${emulatorAndroidTestCommand()}`;

      if (!mobileHelperResult.android) {
        // mobileHelperResult.android is undefined or false
        Logger.error(
          boxen(`${Logger.colors.red(
            'Android setup failed...'
          )}\n\n${errorHelp}\n${setupMsg}\n\n${testCommands}`, {padding: 1})
        );
      } else if (mobileHelperResult.android === true) {
        // do nothing (command passed but verification/setup not initiated)
        // true is returned in cases of --help command.
      } else if (mobileHelperResult.android.status === false) {
        if (mobileHelperResult.android.setup) {
          Logger.error(
            boxen(`${Logger.colors.red(
              'Android setup failed...'
            )}\n\n${errorHelp}\n${setupMsg}\n\n${testCommands}`, {padding: 1})
          );
        } else {
          Logger.info(
            boxen(`${Logger.colors.red(
              'Android setup skipped...'
            )}\n\n${setupMsg}\n\n${testCommands}`, {padding: 1})
          );
        }
      } else {
        // mobileHelperResult.android.status is true.
        if (this.rootDir !== process.cwd()) {
          Logger.info('First, change directory to the root dir of your project:');
          Logger.info(Logger.colors.cyan(`  cd ${relativeToRootDir}`), '\n');
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

      const setupCommand = `  For iOS setup, run: ${Logger.colors.gray.italic('npx @nightwatch/mobile-helper ios --setup')}\n` +
        `  For iOS help, run: ${Logger.colors.gray.italic('npx @nightwatch/mobile-helper ios --help')}`;

      const safariBrowserPresent = answers.mobileBrowsers?.includes('safari');

      const realIosTestCommand = () => {
        const commands = [];
        commands.push('▶ To run an example test on real iOS device');

        if (answers.mobile && safariBrowserPresent) {
          commands.push('  For mobile web tests, run:');
          commands.push(`    ${colors.cyan(mobileExampleCommand(' --env ios.real.safari'))}`);
        }
        
        if (isAppTestingSetup(answers) && answers.runner !== Runner.Cucumber) {
          commands.push('  For mobile app tests, run:');
          commands.push(`    ${colors.cyan(appExampleCommand(' --env app.ios.real', 'ios'))}`);
        }

        return commands.join('\n');
      };

      const simulatorIosTestCommand = () => {
        const commands = [];
        commands.push('▶ To run an example test on iOS simulator');

        if (answers.mobile && safariBrowserPresent) {
          commands.push('  For mobile web tests, run:');
          commands.push(`    ${colors.cyan(mobileExampleCommand(' --env ios.simulator.safari'))}`);
        }

        commands.push('  For mobile app tests, run:');
        commands.push(`    ${colors.cyan(appExampleCommand(' --env app.ios.simulator', 'ios'))}`);

        return commands.join('\n');
      };

      const testCommand = `After completing the setup...\n\n${realIosTestCommand()}\n\n${simulatorIosTestCommand()}`;

      if (!mobileHelperResult.ios) {
        Logger.error(
          boxen(`${Logger.colors.red(
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
          Logger.error(
            boxen(`${Logger.colors.yellow(
              'iOS setup incomplete...'
            )}\n\n${setupHelp}\n${setupCommand}\n\n${testCommand}`, {padding: 1})
          );
        }
      }
    }
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
      Logger.info(`Installing ${Logger.colors.green(pack)}`);

      try {
        execSync(`npm install ${pack} --save-dev`, {
          stdio: ['inherit', 'pipe', 'inherit'],
          cwd: this.rootDir
        });
        Logger.info(Logger.colors.green('Done!'), '\n');
      } catch (err) {
        Logger.error(`Failed to install ${pack}. Please run 'npm install ${pack} --save-dev' later.\n`);
      }
    }
  }
}

module.exports = new NightwatchTooling();