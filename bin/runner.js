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
    var deprecatedValue = './settings.json';

    if (fs.existsSync(defaultValue)) {
      argv.c = path.join(path.resolve('./'), argv.c);
    } else if (fs.existsSync(deprecatedValue)) {
      argv.c = path.join(path.resolve('./'), deprecatedValue);
    } else {
      var defaultFile = path.join(__dirname, argv.c);
      if (fs.existsSync(defaultFile)) {
        argv.c = defaultFile;
      } else {
        argv.c = path.join(__dirname, deprecatedValue);
      }
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
 * Reads globals from an external js or json file
 * @param {string} file
 * @returns {*}
 */
function readExternalGlobals(file) {
  try {
    var fullPath = path.resolve(file);
    if (fs.existsSync(fullPath)) {
      return require(fullPath);
    }
    throw new Error('External global file could not be located - using '+ file +'.');
  } catch (err) {
    err.message = 'Failed to load external global file: ' + err.message;
    throw err;
  }
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

  if (test_settings.selenium && typeof (test_settings.selenium) == 'object') {
    for (var prop in test_settings.selenium) {
      settings.selenium[prop] = test_settings.selenium[prop];
    }
  }
  if (typeof settings.globals == 'string' && settings.globals) {
    var globals = readExternalGlobals(settings.globals);
    if (globals && globals.hasOwnProperty(argv.e)) {
      test_settings.globals = globals[argv.e];
    }
  }

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

    // setting the path where the tests are located
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

    var errorHandler = function(err) {
      if (err) {
        if (err.message) {
          Logger.error(err.message);
        } else {
          Logger.error('There was an error while running the test.');
        }
      }
    };

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
          src_folders : settings.src_folders
        }, function(err) {
          errorHandler(err);
          selenium.stopServer();
        });
      });
    } else {
      runner.run(testsource, test_settings, {
        output_folder : output_folder
      }, function(err) {
        errorHandler(err);
      });
    }
  }
} catch (ex) {
  Logger.error('There was an error while starting the test runner:\n');
  console.log(ex.stack);
}
