/**
 * Module dependencies
 */
const path = require('path');
const Nightwatch = require('../lib/index.js');
const {
  Logger,
  shouldReplaceStack,
  alwaysDisplayError,
  loadTSNode,
  findTSConfigFile,
  fileExistsSync
} = require('../lib/utils');

try {
  Nightwatch.cli(function (argv) {

    const isTypescriptProject = fileExistsSync(path.join(process.cwd(), 'tsconfig.json'));
    if (isTypescriptProject) {
      const projectTsFilePath = findTSConfigFile();

      if (projectTsFilePath !== '') {
        loadTSNode(projectTsFilePath);
      } else {
        Logger.info('Now you can run TS tests directly using Nightwatch.\nFollow this document to learn more.');
      }
    }

    argv._source = argv['_'].slice(0);

    const runner = Nightwatch.CliRunner(argv);

    return runner
      .setupAsync()
      .catch(err => {
        if (err.code === 'ERR_REQUIRE_ESM') {
          err.showTrace = false;
        }

        throw err;
      })
      .then(() => runner.runTests())
      .catch((err) => {
        if (!err.displayed || alwaysDisplayError(err) && !err.displayed) {
          Logger.error(err);
        }

        runner.processListener.setExitCode(10).exit();
      });
  });
} catch (err) {
  const {message} = err;
  err.message = 'An error occurred while trying to start the Nightwatch Runner:';
  err.showTrace = !shouldReplaceStack(err);
  err.detailedErr = message;

  Logger.error(err);

  process.exit(2);
}
