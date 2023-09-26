const {fileExistsSync, Logger} = require('../utils');
const path = require('path');

function getRerunFailedFile(minimal_report_file_path) {
  const jsonFile = path.resolve(process.env.NIGHTWATCH_RERUN_REPORT_FILE || minimal_report_file_path || '');

  if (!fileExistsSync(jsonFile)) {
    const err = new Error('Unable to find the Json reporter file to rerun failed tests');

    err.showTrace = false;
    err.detailedErr = 'Configure the environment variable NIGHTWATCH_RERUN_REPORT_FILE with Json reporter file path';
    err.help = [
      `Try setting ${Logger.colors.cyan('minimal_report_file_path: "JSON-REPORTER-PATH"')} in nightwatch configuration`,
      `Or, try running: ${Logger.colors.cyan('export NIGHTWATCH_RERUN_REPORT_FILE="JSON-REPORTER-PATH"')}`
    ];

    throw err;
  }

  return jsonFile;
}

function getTestSourceForRerunFailed(settings) {
  const {reporter_options: {minimal_report_file_path}} = settings;
  const minimalJsonFile = getRerunFailedFile(minimal_report_file_path);

  try {
    const {modules = {}} = require(minimalJsonFile);
    const testsource = [];
  
    Object.keys(modules).forEach(moduleKey => {
      if (modules[moduleKey] && modules[moduleKey].status === 'fail') {
        testsource.push(modules[moduleKey].modulePath);
      }
    });

    if (testsource.length === 0) {
      const err = new Error('Rerun Failed Tests: No failed tests found to rerun.');
      err.noFailedTestFound = true;
      err.showTrace = false;
      err.detailedErr = 'Run nightwatch with --help to display usage info.';

      throw err;
    }

    return testsource;
  } catch (err) {
    if (err.noFailedTestFound) {
      err.message = 'Rerun Failed Tests: Invalid Json reporter.';

      err.showTrace = false;
      err.detailedErr = 'Please set env variable NIGHTWATCH_RERUN_REPORT_FILE with valid Json reporter path.';
    }

    throw err;
  }
}

module.exports = {
  getRerunFailedFile,
  getTestSourceForRerunFailed
};
