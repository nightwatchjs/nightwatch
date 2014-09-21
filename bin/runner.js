/**
 * Module dependencies
 */
var Logger = require('../lib/util/logger.js');
var cli = require('./_cli.js');
var CliRunner = require('./_clirunner.js');

// CLI definitions

// $ nightwatch -c
// $ nightwatch --config
cli.command('config')
  .demand(true)
  .description('Path to configuration file')
  .alias('c')
  .defaults('./nightwatch.json');

// $ nightwatch -o
// $ nightwatch --output
cli.command('output')
  .description('Where to save the JUnit XML test reports.')
  .alias('o')
  .defaults('tests_output');

// $ nightwatch -e
// $ nightwatch --env saucelabs
cli.command('env')
  .description('Testing environment to use.')
  .alias('e')
  .defaults('default');

// $ nightwatch --verbose
cli.command('verbose')
  .description('Turns on selenium command logging during the session.');

// $ nightwatch -t
// $ nightwatch --test
cli.command('test')
  .description('Runs a single test.')
  .alias('t');

// $ nightwatch -g
// $ nightwatch --group
cli.command('group')
  .description('Runs a group of tests (i.e. a folder)')
  .alias('g');

// $ nightwatch -s
// $ nightwatch --skipgroup
cli.command('skipgroup')
  .description('Skips one or several (comma separated) group of tests.')
  .alias('s');

// $ nightwatch -f
// $ nightwatch --filter
cli.command('filter')
  .description('Specify a filter (glob expression) as the file name format to use when loading the files.')
  .defaults('')
  .alias('f');

// $ nightwatch -a
// $ nightwatch --tag
cli.command('tag')
  .description('Only run tests with the given tag.')
  .defaults('')
  .alias('a');

// $ nightwatch -h
// $ nightwatch --help
cli.command('help')
  .description('Shows this help.')
  .alias('h');

// $ nightwatch -v
// $ nightwatch --version
cli.command('version')
  .alias('v')
  .description('Shows version information.');

try {
  var argv = cli.init();
  if (argv.help) {
    cli.showHelp();
  } else if (argv.version) {
    var packageConfig = require(__dirname + '/../package.json');
    console.log(packageConfig.name + ' v' + packageConfig.version);
  } else {
    process.chdir(process.cwd());

    var runner = module.exports = new CliRunner(argv);
    runner.init().runTests();
  }
} catch (ex) {
  Logger.error('There was an error while starting the test runner:\n\n');
  process.stderr.write(ex.stack + '\n');
  process.exit(2);
}
