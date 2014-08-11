var BASE_PATH = process.env.NIGHTWATCH_COV
  ? 'lib-cov'
  : 'lib';

var path = require('path');

module.exports = {
  setUp : function(cb) {
    this.Runner = require('../../../'+ BASE_PATH +'/runner/run.js');
    cb();
  },

  tearDown : function(callback) {
    delete require.cache[require.resolve('../../../'+ BASE_PATH +'/runner/run.js')];
    callback();
  },

  testRunEmptyFolder : function(test) {
    var testsPath = path.join(process.cwd(), '/sampletests/empty');
    this.Runner.run([testsPath], {}, {
      output_folder : false
    }, function(err) {
      test.ok(err.message.indexOf('No tests defined!') == 0);
      test.done();
    });
  },

  testRunSimple : function(test) {
    var testsPath = path.join(process.cwd(), '/sampletests/simple');
    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      }
    }, {
      output_folder : false
    }, function(err, results) {
      test.equals(err, null);
      test.ok('sample' in results.modules);
      test.ok('demoTest' in results.modules.sample);
      test.done();
    });
  },

  testRunWithExcludeFolder : function(test) {
    var testsPath = path.join(process.cwd(), '/sampletests/withexclude');
    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      },
      exclude : ['excluded']
    }, {
      output_folder : false
    }, function(err, results) {
      test.ok(!('excluded-module' in results.modules));
      test.done();
    });
  },

  testRunWithExcludePattern : function(test) {
    var testsPath = path.join(process.cwd(), '/sampletests/withexclude');
    var testPattern = path.join('excluded', 'excluded-*');
    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      },
      exclude : [testPattern]
    }, {
      output_folder : false
    }, function(err, results) {
      test.ok(!('excluded-module' in results.modules));
      test.done();
    });
  },

    testRunWithFilterPattern : function(test) {
        var testsPath = path.join(process.cwd(), '/sampletests/withexclude');
        var testPattern = path.join('excluded', 'excluded-*');
        this.Runner.run([testsPath], {
            seleniumPort : 10195,
            silent : true,
            output : false,
            globals : {
                test : test
            },
            filter : [testPattern]
        }, {
            output_folder : false
        }, function(err, results) {

            test.ok(('excluded-module' in results.modules));
            test.ok(!('sample' in results.modules));
            test.done();
        });
    },

    testRunWithNonJSFilterPattern : function(test) {
        var testsPath = path.join(process.cwd(), '/sampletests/coffee');
        this.Runner.run([testsPath], {
            seleniumPort : 10195,
            silent : true,
            output : false,
            globals : {
                test : test
            },
            filter : '**/*.coffee'
        }, {
            output_folder : false
        }, function(err, results) {
            test.ok(('simpleCoffee' in results.modules));
            test.ok(!('sample' in results.modules));
            test.done();
        });
    },

    testRunWithNonJSExludePattern : function(test) {
        var testsPath = path.join(process.cwd(), '/sampletests/coffee');
        this.Runner.run([testsPath], {
            seleniumPort : 10195,
            silent : true,
            output : false,
            globals : {
                test : test
            },
            exclude : '**/*.js'
        }, {
            output_folder : false
        }, function(err, results) {
            test.ok(('simpleCoffee' in results.modules));
            test.ok(('sampleCoffee' in results.modules));
            test.ok(!('sample' in results.modules));
            test.done();
        });
    },

  testRunAsync : function(test) {
    test.expect(5);
    var testsPath = path.join(process.cwd(), '/sampletests/async');
    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      }
    }, {
      output_folder : false
    }, function(err, results) {
        test.equals(err, null);
      test.ok('sample' in results.modules);
      test.ok('demoTestAsync' in results.modules.sample);
      test.done();
    });
  },

  testRunMixed : function(test) {
    test.expect(6);
    var testsPath = path.join(process.cwd(), '/sampletests/mixed');
    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      }
    }, {
      output_folder : false
    }, function(err, results) {
      test.equals(err, null);
      test.ok('sample' in results.modules);
      test.ok('demoTestMixed' in results.modules.sample);
      test.done();
    });
  },

  testRunWithTags : function(test) {
    var testsPath = path.join(process.cwd(), 'sampletests');

    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      },
      tag_filter : ['login']
    }, {
      output_folder : false
    }, function(err, results) {
      test.ok(('demoTagTest' in results.modules.sample), 'demoTagTest was ran');
      test.ok(Object.keys(results.modules).length === 1, 'There was only 1 test running.');
      test.done();
    });
  },

  testRunWithOutput : function(test) {
    var src_folders = [
      path.join(process.cwd(), 'sampletests/withsubfolders')
    ];

    this.Runner.run(src_folders, {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      }
    }, {
      output_folder : 'output',
      src_folders : src_folders
    }, function(err, results) {
      test.equals(err, null);
      var fs = require('fs');
      fs.readdir(src_folders[0], function(err, list) {
        test.deepEqual(list, ['simple', 'tags'], 'The subfolders have been created.');
        var simpleReportFile = 'output/simple/FIREFOX_TEST_TEST_sample.xml';
        var tagsReportFile = 'output/tags/FIREFOX_TEST_TEST_sample.xml';

        test.ok(fs.existsSync(simpleReportFile), 'The simple report file was not created.');
        test.ok(fs.existsSync(tagsReportFile), 'The tags report file was not created.');
        test.done();
      });

    });
  }
};
