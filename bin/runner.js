var fs = require('fs'), path = require('path');
var Logger = require('../lib/logger.js');
  
try {
  var DEFAULTS = {
      config : {
        demand : true,
        alias : 'c',
        description : 'Path to configuration file',
        default: './settings.json'
      },
      output : {
        alias : 'o',
        description : 'Where to save the junit xml test reports.',
        default : 'tests_output'
      },
      env : {
        alias : 'e',
        description : 'Testing environment to use',
        default: 'default'
      },
      verbose : {
        alias : 'v',
        description : 'Turns on selenium command logging during the session'
      },
      test : {
        alias : 't',
        description : 'Run a single test'  
      },
      group : {
        alias : 'g',
        description : 'Run a single group of tests (a folder)'  
      },
      skipgroup : {
        alias : 's',
        description : 'Skip one or several (comma separated) group of tests'
      },
      help : {
        alias : 'h',
        description : 'Shows this help'
      }
  };
  
  var opt = require('optimist');
  var argv = opt.usage('Usage: $0 [options]')
              .options(DEFAULTS)
              .argv;
  if (argv.help) {
    opt.showHelp();
  } else {
    if (argv.c === DEFAULTS.config["default"]) {
      if (fs.existsSync('./settings.json')) {
        argv.c = path.join(path.resolve('./'), argv.c);  
      } else {
        argv.c = path.join(__dirname, argv.c);
      }
    } 
    
    process.chdir(process.cwd());
    try {
      var settings = require(argv.c);
    } catch (ex) {
      var settings = {};
    }  
    
    var runner = require(__dirname + '/../runner/run.js');
    if (!(argv.e in settings.test_settings)) {
      throw new Error("Invalid testing environment specified: " + argv.e);
    }
    var output_folder;
    if (argv.o !== DEFAULTS.output["default"] || typeof settings.output_folder == "undefined" || 
      settings.output_folder == "") {
      output_folder = argv.o;
    } else {
      output_folder = settings.output_folder;
    } 
    
    var test_settings = settings.test_settings && settings.test_settings[argv.e] || {};
    test_settings.custom_commands_path = settings.custom_commands_path;
    
    if (typeof argv.t == 'string') {
      var testsource =  (argv.t.indexOf(process.cwd()) === -1) ? 
                      path.join(process.cwd(), argv.t) :
                      argv.t;
      testsource.substr(-3) === '.js' || (testsource += '.js');
      fs.statSync(testsource);                      
    } else if (typeof argv.g == 'string') {
      testsource = [argv.g];
    } else {
      testsource = settings.src_folders;
    }
    
    if (argv.v) {
      test_settings.silent = false;
    }
    
    if (typeof argv.s == 'string') {
      test_settings.skipgroup = argv.s.split(',');
    }
    
    runner.startSelenium(settings, test_settings, function(error, child, error_out, exitcode) {
      if (error) {
        Logger.error('There was an error while starting the Selenium server:');
        console.log(error_out);
        process.exit(exitcode);
      }
      
      runner.run(testsource, test_settings, {
        output_folder : output_folder,
        selenium : (settings.selenium || null)
      }, function() {
        if (settings.selenium && settings.selenium.start_process) {
          runner.stopSelenium();  
        }
      });
    });
  }
} catch (ex) {
  Logger.error('There was an error while starting the test runner:');
  console.trace();
  console.log(Logger.colors.red(ex.message));
}
