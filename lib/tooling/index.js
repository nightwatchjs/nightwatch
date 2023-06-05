const path = require('path');
const {execSync} = require('child_process');
const PackageJson = require('@npmcli/package-json');
const {Logger} = require('../../lib/utils');

class NightwatchTooling {

  async install(argv) {
    const pkgJson = new PackageJson('./');
    await pkgJson.load();
    this.nightwatchConfig = pkgJson.content.nightwatch || {};
    this.nightwatchConfig.plugins = this.nightwatchConfig.plugins || [];
    this.rootDir = path.resolve('./');

    switch (argv.install) {
      case 'component-testing':
        this.installComponentTesting();
        break;

      case 'vrt':
        this.installVrt();
        break;

      case 'accessibility-testing':
        this.installAccessibilityTesting();
        break;

      case 'unit-testing':
      case 'api-testing':
        this.installAPITesting();
        break;

      default:
        throw new Error(`Unsupported option: ${argv.install}`);
    }

    await pkgJson.load();

    pkgJson.update({
      nightwatch: this.nightwatchConfig
    });

    await pkgJson.save();
  }

  printHelp() {
    // TODO: implement print help
  }

  async installComponentTesting() {
    // eslint-disable-next-line no-console
    console.log('Install compoenet testing plugins and config');
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

      Logger.info(`Make sure browser session is turned off during API testing: 
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

  async installAccessibilityTesting() {
    // eslint-disable-next-line no-console
    console.log('Install compoenet testing plugins and config');
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