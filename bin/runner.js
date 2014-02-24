/**
 * Module dependencies
 */
var fs = require('fs');
var path = require('path');
var Logger = require('../lib/logger.js');
var cli = require('./_cli.js');


// CLI definitions

// $ nightwatch -c
// $ nightwatch --config
cli.command('config')
  .demand(true)
  .description('Path to configuration file')
  .alias('c')
  .defaults('./settings.json');

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

// $ nightwatch -s
// $ nightwatch --skipgroup
cli.command('help')
  .description('Shows this help.')
  .alias('h');

// $ nightwatch --version
cli.command('version')
  .alias('v')
  .description('Shows version information.');

/**
 * Looks for pattern ${VAR_NAME} in settings
 * @param {Object} target
 */
function replaceEnvVariables(target) {
  for (var key in target) {
    switch(typeof target[key]) {
      case 'object':
        replaceEnvVariables(target[key]);
        break;
      case 'string':
        target[key] = target[key].replace(/\$\{(\w+)\}/g, function(match, varName) {
          return process.env[varName] || '${' + varName + '}';
        });
        break;
    }
  }
}

/**
 * Read the provided config json file; defaults to settings.json if one isn't provided
 * @param {Object} argv
 */
function readSettings(argv) {
  var settings;

  // use default settings.json file if we haven't received another value
  if (cli.command('config').isDefault(argv.c)) {
    var defaultValue = cli.command('config').defaults();

    if (fs.existsSync(defaultValue)) {
      argv.c = path.join(path.resolve('./'), argv.c);
    } else {
      argv.c = path.join(__dirname, argv.c);
    }
  } else {
    argv.c = path.resolve(argv.c);
  }

  // reading the settings file
  try {
    settings = require(argv.c);
    replaceEnvVariables(settings);
  } catch (ex) {
    Logger.error(ex);
    settings = {};
  }

  return settings;
}

/**
 *
 * @param {Object} argv
 */
function parseTestSettings(argv) {
  // checking if the env passed is valid
  if (!settings.test_settings) {
    throw new Error('No testing environment specified.');
  }
  if (!(argv.e in settings.test_settings)) {
    throw new Error('Invalid testing environment specified: ' + argv.e);
  }

  // picking the environment specific test settings
  var test_settings = settings.test_settings[argv.e];
  test_settings.custom_commands_path = settings.custom_commands_path || '';
  test_settings.custom_assertions_path = settings.custom_assertions_path || '';

  if (argv.verbose) {
    test_settings.silent = false;
  }

  if (typeof argv.s == 'string') {
    test_settings.skipgroup = argv.s.split(',');
  }

  if (argv.f) {
    test_settings.filter = argv.f;
  }

  return test_settings;
}

try {
  var argv = cli.init();

  if (argv.help) {
    cli.showHelp();
  } else if (argv.version) {
    var packageConfig = require(__dirname + '/../package.json');
    console.log(packageConfig.name + ' v' + packageConfig.version);
  } else {

    process.chdir(process.cwd());

    // the test runner
    var runner = require(__dirname + '/../runner/run.js');

    var settings = readSettings(argv);

    // setting the output folder
    var output_folder = cli.command('output').isDefault(argv.o) &&
        settings.output_folder || argv.o;

    var test_settings = parseTestSettings(argv);

    // setting the source of the test(s)
    var testsource;
    if (typeof argv.t == 'string') {
      testsource =  (argv.t.indexOf(process.cwd()) === -1) ?
                      path.join(process.cwd(), argv.t) :
                      argv.t;
      if (testsource.substr(-3) != '.js') {
        testsource += '.js';
      }
      fs.statSync(testsource);
    } else if (typeof argv.g == 'string') {
      testsource = [argv.g];
    } else {
      testsource = settings.src_folders;
    }

    // running the tests
    if (settings.selenium && settings.selenium.start_process) {
      var selenium = require(__dirname + '/../runner/selenium.js');

      selenium.startServer(settings, test_settings, function(error, child, error_out, exitcode) {
        if (error) {
          Logger.error('There was an error while starting the Selenium server:');
          console.log(error_out);
          process.exit(exitcode);
        }

        runner.run(testsource, test_settings, {
          output_folder : output_folder,
          selenium : (settings.selenium || null)
        }, function(err) {
          if (err) {
            console.log(Logger.colors.red('There was an error while running the test.'));
          }
          selenium.stopServer();
        });
      });
    } else {
      runner.run(testsource, test_settings, {
        output_folder : output_folder,
        selenium : (settings.selenium || null)
      });
    }
  }
} catch (ex) {
  Logger.error('There was an error while starting the test runner:\n');
  console.log(ex.stack);
}
