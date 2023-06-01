const PackageJson = require('@npmcli/package-json');

class NightwatchTooling {

  static async addPlugin(argv) {
    const pkgJson = new PackageJson('./');
    await pkgJson.load();
    const nightwatchConfig = pkgJson.content.nightwatch || {};

    if (argv.add === 'react') {
      const currentPlugins = nightwatchConfig.plugins || [];
      nightwatchConfig.plugins = [...currentPlugins, 'react'];
      nightwatchConfig.reactConfig = {
        foo: 'bar'
      };
    }

    pkgJson.update({
      nightwatch: nightwatchConfig
    });

    await pkgJson.save();
  }
}

module.exports = NightwatchTooling;