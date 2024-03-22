const open = require('open');
const path = require('path');
const lodashPick = require('lodash/pick');
const HtmlReact = require('@nightwatch/html-reporter-template');
const AnsiConverter = require('ansi-to-html');

const Utils = require('../../utils');
const BaseReporter = require('../base-reporter.js');
const {Logger} = Utils;

class HtmlReporter extends BaseReporter {
  static get hookNames(){
    return ['__before_hook', '__after_hook', '__global_beforeEach_hook', '__global_afterEach_hook'];
  }

  static get ansiConverter(){
    return new AnsiConverter();
  }

  openReporter(fileName) {
    return open(fileName)
      .catch(err => {
        Logger.error('Error opening the report: ', err.message);
      });
  }

  getFolderPrefix() {
    let folderPrefix = '';
    const {folder_format} = this.options;
    if (folder_format) {
      if (typeof folder_format === 'function') {
        folderPrefix = folder_format(this.results);
      } else if (typeof folder_format === 'string') {
        folderPrefix = folder_format;
      }
    }

    return folderPrefix;
  }

  getFileName() {
    let fileName = 'index';
    const {filename_format} = this.options;
    if (filename_format) {
      if (typeof filename_format === 'function') {
        fileName = filename_format(this.results);
      } else if (typeof filename_format === 'string') {
        fileName = filename_format;
      }
    }

    return fileName;
  }

  computePassedAndFailedCounts(module) {
    const result = {passedCount: 0, failedCount: 0};

    if (!module || !module.completedSections) {
      return result;
    }

    for (const sectionName of Object.keys(module.completedSections)) {
      if (HtmlReporter.hookNames.includes(sectionName)) {
        continue;
      }

      const section = module.completedSections[sectionName];
      if (section.status === 'pass') {
        result.passedCount += 1;
      } else {
        result.failedCount += 1;
      }
    }

    return result;
  }

  createInitialResult(module) {
    const {passedCount, failedCount} = this.computePassedAndFailedCounts(module);
    const sessionCapabilities = module.sessionCapabilities || {};

    return  {
      metadata: {
        platformName: sessionCapabilities.platformName,
        device: 'desktop',
        browserName: sessionCapabilities.browserName,
        browserVersion: sessionCapabilities.browserVersion,
        executionMode: 'local'
      },
      stats: {
        passed: passedCount,
        failed: failedCount,
        skipped: module.skippedCount,
        total: passedCount + failedCount + module.skippedCount,
        time: module.timeMs
      },
      modules: {}
    };
  }

  aggregateEnvironments(testEnv, moduleKey, module) {

    if (!this.environments[testEnv]) {
      this.environments[testEnv] = this.createInitialResult(module);
    } else {

      const {passedCount, failedCount} = this.computePassedAndFailedCounts(module);
      const sessionCapabilities = module.sessionCapabilities || {};

      this.environments[testEnv].stats.passed += passedCount;
      this.environments[testEnv].stats.failed += failedCount;
      this.environments[testEnv].stats.skipped += module.skippedCount;
      this.environments[testEnv].stats.total += passedCount + failedCount + module.skippedCount;
      this.environments[testEnv].stats.time += module.timeMs || this.environments[testEnv].stats.time;
      this.environments[testEnv].metadata.platformName = this.environments[testEnv].metadata.platformName || sessionCapabilities.platformName;
      this.environments[testEnv].metadata.browserName = this.environments[testEnv].metadata.browserName || sessionCapabilities.browserName;
      this.environments[testEnv].metadata.browserVersion = this.environments[testEnv].metadata.browserVersion || sessionCapabilities.browserVersion;
    }

    this.environments[testEnv].modules[moduleKey] = this.adaptModule(module);
  }

  aggregateStats() {
    const startTime = new Date(this.results.startTimestamp).getTime();
    const endTime = new Date(this.results.endTimestamp).getTime();

    const stats = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      time: endTime - startTime
    };

    for (const envName of Object.keys(this.environments)) {
      const env = this.environments[envName];

      stats.passed += env.stats.passed;
      stats.failed += env.stats.failed;
      stats.skipped += env.stats.skipped;
      stats.total += env.stats.total;
    }

    return stats;
  }

  getGlobalMetadata() {
    return {
      date: new Date()
    };
  }

  adaptModule(module) {

    // Pick only the necessary fields
    const result = lodashPick(module, [
      'completedSections',
      'rawHttpOutput',
      'assertionsCount',
      'lastError',
      'skipped',
      'time',
      'timeMs',
      'errmessages',
      'testsCount',
      'skippedCount',
      'failedCount',
      'errorsCount',
      'passedCount',
      'group',
      'modulePath',
      'startTimestamp',
      'endTimestamp',
      'sessionCapabilities',
      'sessionId',
      'projectName',
      'buildName',
      'testEnv',
      'isMobile',
      'status',
      'seleniumLog',
      'tests',
      'failures',
      'errors'
    ]);

    // Convert to absolute path
    for (const sectionName of Object.keys(result.completedSections)) {
      const section = result.completedSections[sectionName];
      for (const command of section.commands) {

        const {output_folder} = this.options;
        const destFolder = path.join(output_folder, this.getFolderPrefix(), 'nightwatch-html-report');

        if (command.screenshot) {
          command.screenshot = path.relative(destFolder, command.screenshot);
        }

        if (command.domSnapshot && command.domSnapshot.snapshotFilePath) {
          command.domSnapshot.snapshotFilePath = path.resolve(process.cwd(), command.domSnapshot.snapshotFilePath);
        }
      }
    }

    // Add skipped tests by user in completed section
    module.skippedByUser && module.skippedByUser.forEach(skippedTestName => {
      module.completedSections[skippedTestName] = {
        status: 'skip',
        runtimeFailure: false
      };
    });

    // Add skipped tests at runtime in completed section
    module.skippedAtRuntime && module.skippedAtRuntime.forEach(skippedTestName => {
      module.completedSections[skippedTestName] = {
        status: 'skip',
        runtimeFailure: true
      };
    });

    return result;
  }

  adaptResults() {
    const {modulesWithEnv}  = this.results;
    this.environments = {};

    Object.keys(modulesWithEnv).forEach((env) => {
      const modules = modulesWithEnv[env];

      // Make module paths absolute
      this.results.modulesWithEnv[env] = Object.keys(modules).reduce((prev, value) => {
        this.results.modulesWithEnv[env][value].modulePath = this.results.modulesWithEnv[env][value].modulePath.replace(process.cwd(), '');
        prev[value] = this.results.modulesWithEnv[env][value];

        return prev;
      }, {});

      Object.keys(modules).forEach((moduleKey) => {
        const module = modules[moduleKey];
        this.adaptAssertions(module);
        this.aggregateEnvironments(env, moduleKey, module);
      });
    });

    return {
      environments: this.environments,
      stats: this.aggregateStats(),
      metadata: this.getGlobalMetadata()
    };
  }

  async writeReport() {
    const results = this.adaptResults();

    const {output_folder, openReport: shouldOpenReport} = this.options;
    const destFolder = path.join(output_folder, this.getFolderPrefix(), 'nightwatch-html-report');
    const fileName = `${this.getFileName()}.html`;
    const filePath = path.join(destFolder, `${this.getFileName()}.html`);

    const jsonString = JSON.stringify(results);

    HtmlReact.writeNightwatchHTMLReport(destFolder, fileName, jsonString);

    Logger.logDetailedMessage(Logger.colors.stack_trace(` Wrote HTML report file to: ${path.resolve(filePath)}` + '\n'), 'info');

    if (shouldOpenReport) {
      return this.openReporter(filePath);
    }

  }
}

module.exports = (function() {
  return {
    write(results, options, callback) {
      const reporter = new HtmlReporter(results, options);

      reporter.writeReport()
        .then(_ => {
          callback();
        })
        .catch(err => {
          Logger.error(err);
          callback(err);
        });
    },

    adaptResults(results, options) {
      const reporter = new HtmlReporter(results, options);

      return reporter.adaptResults();
    }
  };
})();
