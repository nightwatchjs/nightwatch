const Mocha = require('mocha');
const {adaptRunnables} = require('./extensions.js');

module.exports = class CustomRunner extends Mocha.Runner {
  async runSuite(suite, fn) {
    const isMainSuite = suite.parent && suite.parent.root;

    const createSession = () => {
      return new Promise(function(resolve, reject) {
        if (isMainSuite) {
          try {
            if (suite.file) {
              suite.nightwatchSuite.setModulePath(suite.file);
            }

            suite.nightwatchSuite
              .updateClient()
              .setupHooks()
              .startTestSuite()
              .then(data => resolve(data))
              .catch(err => reject(err));
          } catch (err) {
            reject(err);
          }
        } else {
          if (!suite.root && suite.parent.nightwatchSuite) {
            suite.nightwatchSuite.createClient(suite.parent.nightwatchSuite.client);
            suite.nightwatchSuite.reporter = suite.parent.nightwatchSuite.reporter;
          }
          resolve(false);
        }
      });
    };

    const onSuiteFinished = (err) => {
      if (!suite.nightwatchSuite) {
        return fn(err);
      }

      suite.nightwatchSuite.onTestSuiteFinished().then(failures => {
        fn(err);
      }).catch(suiteError => {
        console.error(suiteError);
        suiteError = suiteError || err;
        fn(suiteError);
      });
    };

    try {
      if (suite.disabled) {
        // eslint-disable-next-line no-console
        console.log(`Testsuite "${suite.title}" is disabled, skipping...`);

        return fn();
      }

      if (suite['@nightwatch_promise']) {
        await suite['@nightwatch_promise']();
      }

      // create the nightwatch session
      const sessionInfo = await createSession();
    } catch (err) {
      // an error occurred while trying to create the session
      this.failures = err;

      return onSuiteFinished(err);
    }

    // run the mocha suite
    return super.runSuite(suite, onSuiteFinished);
  }

  run(fn) {
    adaptRunnables(this.suite);

    super.run(fn);
  }
};
