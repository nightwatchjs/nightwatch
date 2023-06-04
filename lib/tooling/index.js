const PackageJson = require('@npmcli/package-json');
const {execSync} = require('child_process');
const {Logger} = require('../../lib/utils');

class NightwatchTooling {

  static async installPlugin(argv) {
    const pkgJson = new PackageJson('./');
    await pkgJson.load();
    const nightwatchConfig = pkgJson.content.nightwatch || {};

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

    pkgJson.update({
      nightwatch: nightwatchConfig
    });

    await pkgJson.save();
  }

  static async installComponentTesting() {
    // eslint-disable-next-line no-console
    console.log('Install compoenet testing plugins and config');
  }

  static async installVrt() {
    // eslint-disable-next-line no-console
    console.log('Install compoenet testing plugins and config');
  }

  static async installAPITesting() {
    // eslint-disable-next-line no-console
    console.log('Install compoenet testing plugins and config');
  }

  static async installAccessibilityTesting() {
    // eslint-disable-next-line no-console
    console.log('Install compoenet testing plugins and config');
  }

  static installPackages(packagesToInstall) {
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

module.exports = NightwatchTooling;