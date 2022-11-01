/**
 * Module dependencies
 */
const Nightwatch = require('../lib/index.js');
const {Logger, shouldReplaceStack, alwaysDisplayError} = require('../lib/utils');

try {
  Nightwatch.cli(function (argv) {
    argv._source = argv['_'].slice(0);

    const runner = Nightwatch.CliRunner(argv);

    return runner
      .setupAsync()
      .catch((err) => {
        if (err.code === 'ERR_REQUIRE_ESM') {
          err.showTrace = false;
        }

        throw err;
      })
      .then(() => runner.runTests())
      .catch((err) => {
        if (!err.displayed || (alwaysDisplayError(err) && !err.displayed)) {
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
