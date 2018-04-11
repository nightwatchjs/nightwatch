const Walker = require('./folder-walk.js');
const DefaultRunner = require('./test-runners/default.js');
const MochaRunner = require('./test-runners/mocha.js');

class Runner {
  static get DEFAULT_RUNNER() {
    return 'default';
  }

  static get MOCHA_RUNNER() {
    return 'mocha';
  }

  static createError(err) {
    if (err) {
      switch (err.code) {
        case 'ENOENT':
          return new Error('Cannot read test source location: ' + err.path);
      }

      return err;
    }

    return false;
  }

  static checkTestSource(modules, fullPaths, settings) {
    if (modules && modules.length === 0) {
      let errorMessage = ['No tests defined! using source folder:', fullPaths];
      let err = new Error(errorMessage.join(' '));
      let detailed = [];

      if (settings.tag_filter) {
        detailed.push(`- using tags: ${settings.tag_filter}`);
      }

      if (settings.filter) {
        detailed.push(`- using filter: ${settings.filter}`);
      }

      if (settings.exclude) {
        detailed.push(`- using exclude match: ${settings.exclude}`);
      }

      if (detailed.length) {
        err.detailedErr = detailed.join('\n');
      }

      return err;
    }

    return true;
  }

  static readTestSource(testSource, settings) {
    const walker = new Walker(testSource, settings);

    return walker.readTestSource()
      .catch(err => {
        throw Runner.createError(err);
      })
      .then(modules => {
        let error = Runner.checkTestSource(modules, walker.fullPaths, settings);
        if (error instanceof Error) {
          throw error;
        }

        return modules;
      });
  }

  static create(settings, argv, addtOpts) {
    switch (settings.test_runner.type) {
      case Runner.DEFAULT_RUNNER:
        return new DefaultRunner(settings, argv, addtOpts);

      case Runner.MOCHA_RUNNER:
        return new MochaRunner(settings, argv, addtOpts);
    }
  }
}

module.exports = Runner;