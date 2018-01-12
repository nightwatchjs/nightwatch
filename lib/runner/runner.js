const TestSuite = require('../testsuite/testsuite.js');
const Walker = require('./folder-walk.js');
const ProcessListener = require('./process-listener.js');
const Logger = require('../util/logger.js');

class Runner {
  constructor(testSource, settings) {
    this.processListener = new ProcessListener(this);

    this.settings = settings;
    this.walker = new Walker(testSource, settings);
  }

  createError(err, modules = null) {
    if (err) {
      switch (err.code) {
        case 'ENOENT':
          return new Error('Cannot read source folder: ' + err.path);
      }

      return err;
    }

    if (modules && modules.length === 0) {
      let errorMessage = ['No tests defined! using source folder:', this.walker.fullPaths];
      if (this.settings.tag_filter) {
        errorMessage.push('; using tags:', this.settings.tag_filter);
      }

      return new Error(errorMessage.join(' '));
    }

    return false;
  }

  runMultipleTests(modules) {
    let modulePaths = modules.slice(0);

    return new Promise(function runTestModule(resolve, reject) {
      let modulePath = modulePaths.shift();

      this.runTestSuite(modulePath, modules)
        .then(() => {
          if (modulePaths.length === 0) {
            resolve();
          } else {
            setImmediate(runTestModule.bind(this), resolve, reject);
          }
        })
        .catch(function(err) {
          reject(err);
        });
    }.bind(this));
  }

  /**
   * @return {Promise}
   */
  terminate() {
    if (this.currentSuite) {
      Logger.info(`Attempting to close session ${this.currentSuite.client.sessionId}...`);

      return this.currentSuite.terminate();
    }

    return Promise.resolve();
  }

  runTestSuite(modulePath, modules) {
    try {
      this.currentSuite = new TestSuite(modulePath, modules, this.settings, {

      });
    } catch (err) {
      err = this.createError(err);
      throw err;
    }

    return this.currentSuite.run();
  }

  saveReport(results) {
    // TODO: write report

    return this.terminate();
  }

  /**
   * Main entry-point of the runner
   *
   * @return {Promise}
   */
  run() {
    return this.walker.readTestSource()
      .catch(err => {
        return this.createError(err)
      })
      .then(modules => {
        let error = this.createError(null, modules);
        if (error) {
          throw error;
        }

        return this.runMultipleTests(modules);
      })
      .catch(err => {
        console.error('\n', Logger.colors.red(err.message));
        if (err.data) {
          console.warn(' ' + err.data);
        }
        console.log('');

      })
      .then(() => {
        return this.saveReport();
      });
  }
}

module.exports = Runner;