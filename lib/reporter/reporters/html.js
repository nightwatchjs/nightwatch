const fs = require('fs');
const open = require('open');
const path = require('path');
const HtmlReact = require('html-reporter');
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

  static computePassedAndFailedCounts(module) {
    const result = {passedCount: 0, failedCount: 0};

    if (!module.completedSections) {
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

  static aggregateEnvironments(modulesWithEnv) {
    const environments = {};

    for (const testEnv of Object.keys(modulesWithEnv)) {
      const modules = modulesWithEnv[testEnv];

      for (const moduleKey of Object.keys(modules)) {
        const module = modules[moduleKey];
  
  
        const {passedCount, failedCount} = HtmlReporter.computePassedAndFailedCounts(module);
        
        if (!environments[testEnv]) {
          environments[testEnv] = {
            metadata: {
              'platformName': module.sessionCapabilities.platformName,
              'device': 'desktop',
              'browserName': module.sessionCapabilities.browserName,
              'browserVersion': module.sessionCapabilities.browserVersion,
              'executionMode': 'local'
            },
            stats: {
              'passed': passedCount,
              'failed': failedCount,
              'skipped': module.skippedCount,
              'total': passedCount + failedCount + module.skippedCount,
              'time': module.timeMs 
            },
            modules: {}
          };
        } else {
          environments[testEnv].stats.passed += passedCount;
          environments[testEnv].stats.failed += failedCount;
          environments[testEnv].stats.skipped += module.skippedCount;
          environments[testEnv].stats.total += passedCount + failedCount + module.skippedCount;
          environments[testEnv].stats.time = environments[testEnv].stats.time || module.timeMs;
          environments[testEnv].metadata.platformName = environments[testEnv].metadata.platformName || module.sessionCapabilities.platformName;
          environments[testEnv].metadata.browserName = environments[testEnv].metadata.browserName || module.sessionCapabilities.browserName;
          environments[testEnv].metadata.browserVersion = environments[testEnv].metadata.browserVersion || module.sessionCapabilities.browserVersion;
        }
 
        environments[testEnv].modules[moduleKey] = HtmlReporter.adaptModule(module);
      }
    }

    return environments;
  }

  static aggregateStats(environments) {
    const stats = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      time: 0
    };
    
    for (const envName of Object.keys(environments)) {
      const env = environments[envName];

      stats.passed += env.stats.passed;
      stats.failed += env.stats.failed;
      stats.skipped += env.stats.skipped;
      stats.total += env.stats.total;
      stats.time += env.stats.time || 0;
    }

    return stats;
  }

  static adaptModule(module) {

    // Pick only the necessary fields
    const result =  {
      completedSections: module.completedSections,
      rawHttpOutput: module.rawHttpOutput,
      assertionsCount: module.assertionsCount,
      lastError: module.lastError,
      skipped: module.skipped,
      time: module.time || 0,
      timeMs: module.timeMs || 0,
      errmessages: module.errmessages,
      testsCount: module.testsCount,
      skippedCount: module.skippedCount,
      failedCount: module.failedCount,
      errorsCount: module.errorsCount,
      passedCount: module.passedCount,
      group: module.group,
      modulePath: module.modulePath,
      startTimestamp: module.startTimestamp,
      endTimestamp: module.endTimestamp,
      sessionCapabilities: module.sessionCapabilities,
      sessionId: module.sessionId,
      projectName: module.projectName,
      buildName: module.buildName,
      testEnv: module.testEnv,
      isMobile: module.isMobile,
      status: module.status,
      seleniumLog: module.seleniumLog,
      tests: module.tests,
      failures: module.failures,
      errors: module.errors
    };

    // Convert to absolute path
    for (const sectionName of Object.keys(result.completedSections)) {
      const section = result.completedSections[sectionName];
      for (const command of section.commands) {
        if (command.screenshot) {
          command.screenshot = path.resolve(process.cwd(), command.screenshot);
        }
  
        if (command.domSnapshot) {
          command.domSnapshot.snapshotFilePath = path.resolve(process.cwd(), command.domSnapshot.snapshotFilePath);
        }
      }
    }

    for (const skippedTestName of module.skipped) {
      module.completedSections[skippedTestName] = {
        status: 'skip'
      };
    }
  
    return result;
  }

  adaptResults(results) {
    const {modulesWithEnv}  = results;

    Object.keys(modulesWithEnv).forEach((env) => {
      const modules = modulesWithEnv[env];
      Object.keys(modules).forEach((moduleKey) => {
        const module = modules[moduleKey];
        this.adaptAssertions(module);
      });

      results.modulesWithEnv[env] = Object.keys(modules).reduce((prev, value) => {
        results.modulesWithEnv[env][value].modulePath = results.modulesWithEnv[env][value].modulePath.replace(process.cwd(), '');
        prev[value] = results.modulesWithEnv[env][value];
        
        return prev;
      }, {});
    });
    
    
    const adaptedResult = {};
    adaptedResult.environments = HtmlReporter.aggregateEnvironments(modulesWithEnv);
    adaptedResult.stats = HtmlReporter.aggregateStats(adaptedResult.environments);
    adaptedResult.metadata = {
      date: new Date()
    };

    return adaptedResult;
  }

  async writeReport() {
    const results = this.adaptResults(this.results);

    const output_folder = this.options.output_folder;
    const shouldOpenReport = this.options.openReport;
    
    const destFolder = path.join(output_folder, this.getFolderPrefix(), 'nightwatch-htmlv2-report');
    const filename = path.join(destFolder, 'index.html');

    const jsonString = JSON.stringify(results);

    HtmlReact.writeNightwatchHTMLReport(destFolder, jsonString);

    Logger.logDetailedMessage(Logger.colors.stack_trace(` Wrote HTML report file to: ${path.resolve(filename)}` + '\n'), 'info');

    if (shouldOpenReport) {
      return this.openReporter(filename);
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
    }
  };
})();
