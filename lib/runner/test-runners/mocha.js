const path = require('path');
const Concurrency = require('../concurrency');
const Utils = require('../../utils');
const {Logger} = Utils;
const {augmentTestSuite} = require('./mocha/extensions.js');

class MochaRunner {
  static MochaNightwatch({argv, settings, addtOpts}) {
    const Mocha = require('mocha');
    const CustomRunner = require('./mocha/custom-runner.js');

    return class MochaNightwatch extends Mocha {
      constructor(mochaOpts, nightwatchSettings) {
        super(mochaOpts);
        this.nightwatchSettings = nightwatchSettings;
        this._runnerClass = CustomRunner;

        const runner = this;

        this.suite.on('suite', suite => {
          suite.on('suite', childSuite => {
            augmentTestSuite({suite: childSuite, runner, argv, settings, addtOpts});
          });

          augmentTestSuite({suite, runner, argv, settings, addtOpts});
        });
      }
    };
  }

  get supportsConcurrency() {
    return true;
  }

  get combinedReporterList() {
    return ['mochawesome'];
  }

  get type() {
    return 'mocha';
  }

  constructor(settings, argv, addtOpts = {}) {
    this.startTime = new Date().getTime();
    this.settings = settings;
    this.argvOpts = argv;
    this.publishReport = false;
    this.argv = argv;
    this.processListener = addtOpts.processListener;

    this.mochaOpts = settings.test_runner.options || {};
    if (Utils.isUndefined(this.mochaOpts.timeout)) {
      this.mochaOpts.timeout = settings.globals.asyncHookTimeout;
    }

    if (this.settings.disable_colors) {
      this.mochaOpts.color = false;
    }

    if (argv.reporter && argv.reporter !== 'junit') {
      this.mochaOpts.reporter = argv.reporter;
    }

    if (argv.grep) {
      this.mochaOpts.grep = argv.grep;
    }

    if (argv['fail-fast']) {
      this.mochaOpts.bail = true;
    }

    if (argv.retries) {
      this.mochaOpts.retries = argv.retries;
    }

    if (argv.fgrep) {
      this.mochaOpts.fgrep = argv.fgrep;
    }

    if (argv.invert) {
      this.mochaOpts.invert = argv.invert;
    }

    this.mochaOpts.reporterOptions = this.mochaOpts.reporterOptions || {};

    if (argv.reporter === 'mocha-junit-reporter') {
      this.mochaOpts.reporterOptions.mochaFile = path.join(settings.output_folder, 'test-results.xml');
    }

    if (this.isTestWorker()) {
      const filePath = this.argv.test;
      const reportFilename = filePath.substring(filePath.lastIndexOf('/')+1).split('.')[0];
      this.mochaOpts.isWorker = true;

      switch (argv.reporter) {
        case 'mocha-junit-reporter':
        case 'mochawesome':
          this.mochaOpts.reporterOptions.mochaFile = path.join(settings.output_folder, `${reportFilename}.xml`);
          break;
      }

      if (argv.reporter === 'mochawesome') {
        this.mochaOpts.reporterOptions = Object.assign(this.mochaOpts.reporterOptions, {
          //overwrite: false,
          html: false,
          json: true
        });
      }
    }

    const MochaNightwatch = MochaRunner.MochaNightwatch({settings, argv, addtOpts});
    this.mocha = new MochaNightwatch(this.mochaOpts, settings);
  }

  async runConcurrent(testEnvArray, modules) {
    this.checkReporterDependencies();

    this.concurrency = new Concurrency(this.settings, this.argv);
    const exitCode = await this.concurrency.runMultiple(testEnvArray, modules);

    await this.generateCombinedReport();

    return exitCode;
  }

  checkReporterDependencies() {
    if (this.argv.reporter !== 'mochawesome') {
      return;
    }

    try {
      require('mochawesome-report-generator');
      require('mochawesome-merge');
    } catch (err) {
      const error = new Error('Nightwatch needs some more packages when running in parallel and using the mochawesome reporter:');
      error.detailedErr = 'To install dependencies, please run:\n    npm install mochawesome-report-generator mochawesome-merge --save-dev';

      throw error;
    }
  }

  async generateCombinedReport() {
    if (!this.combinedReporterList.includes(this.argv.reporter)) {
      return;
    }

    const {reportDir} = this.mochaOpts.reporterOptions;

    switch (this.argv.reporter) {
      case 'mochawesome': {
        const marge = require('mochawesome-report-generator');
        const {merge} = require('mochawesome-merge');
        const files = reportDir ? `${path.join(reportDir, '*.json')}` : './mochawesome-report/*.json';

        const report = await merge({
          files: [files]
        });

        return marge.create(report, {});
      }
    }
  }

  isTestWorker() {
    return this.argv['test-worker'];
  }

  closeOpenSessions() {
    const mochaSuite = this.mocha.suite;
    const client = mochaSuite && mochaSuite.client;

    if (client && client.sessionId) {
      let request = client.transport.createHttpRequest({
        path: `/session/${client.sessionId}`
      });

      return new Promise(function(resolve, reject) {
        request.delete()
          .on('error', function(err) {
            resolve();
          })
          .on('success', function() {
            resolve();
          });
      });
    }

    return Promise.resolve();
  }

  registerUncaughtErr(err) {
  }
  /**
   * Main entry-point of the runner
   *
   * @return {Promise}
   */
  run(modules) {
    modules.forEach(module => this.mocha.addFile(module));

    return new Promise((resolve, reject) => {
      this.mocha.run(failures => {
        if ((failures instanceof Error) && failures.sessionCreate) {
          Logger.error(failures);
          process.exit(1);
        }


        this.closeOpenSessions()
          .then(_ => {
            if (this.mocha.suite && this.mocha.suite.client) {
              return this.mocha.suite.client.transport.sessionFinished();
            }
          })
          .catch(err => {
            console.error(err.stack);
          })
          .then(_ => {
            if (failures) {
              return reject(failures instanceof Error ? failures : new Error('Mocha reported test failures.'));
            }

            resolve();
          });
      });
    });

  }
}

module.exports = MochaRunner;
