const TestSource = require('./test-source.js');
const Walker = require('./folder-walk.js');
const DefaultRunner = require('./test-runners/default.js');

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
          return new Error(`Cannot read test source location: ${err.path}`);
      }

      return err;
    }

    return false;
  }

  static checkTestSource(modules, testSource, settings) {
    // TODO: refactor this into TestSource
    if (modules && modules.length === 0) {
      let errorMessage = ['No tests defined! using source folder:', testSource];
      let err = new Error(errorMessage.join(' '));
      let detailed = [];

      if (settings.tag_filter && settings.tag_filter.length) {
        detailed.push(`- using tags filter: ${settings.tag_filter}`);
      }

      if (settings.skiptags && settings.skiptags.length) {
        detailed.push(`- using skiptags filter: ${settings.skiptags}`);
      }

      if (settings.filter) {
        detailed.push(`- using path filter: ${settings.filter}`);
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

  static getTestSource(settings, argv = {}) {
    const testSource = new TestSource(settings, argv);

    return new Walker(testSource.getSource(), settings, argv);
  }

  static readTestSource(settings, argv = {}) {
    const walker = Runner.getTestSource(settings, argv);

    return walker.readTestSource()
      .catch(err => {
        throw Runner.createError(err);
      })
      .then(modules => {
        let error = Runner.checkTestSource(modules, walker.testSource, settings);
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

      case Runner.MOCHA_RUNNER: {
        const MochaRunner = require('./test-runners/mocha.js');

        return new MochaRunner(settings, argv, addtOpts);
      }
    }
  }
}

module.exports = Runner;
