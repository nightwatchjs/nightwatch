const path = require('path');
const fs = require('fs');
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
        ${Logger.colors.brown('mobile')}                  :: Sets up tools to run tests on real mobile devices using Nightwatch. 
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