var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var path = require('path');

module.exports = {
  setUp : function(cb) {
    this.Runner = require('../../../'+ BASE_PATH +'/runner/run.js');
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
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
      test.ok(err.message.indexOf('No tests defined!') === 0);
      test.done();
    });
  },

  testRunSimple : function(test) {
    test.expect(5);
    var testsPath = path.join(process.cwd(), '/sampletests/simple');
    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      }
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.equals(err, null);
      test.ok('sample' in results.modules);
      test.ok('demoTest' in results.modules.sample.completed);
      test.done();
    });
  },

  testRunWithJUnitOutput : function(test) {
    var src_folders = [
      path.join(process.cwd(), 'sampletests/withsubfolders')
    ];
    var currentTestArray = [];

    this.Runner.run(src_folders, {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test,
        beforeEach : function(client, done) {
          currentTestArray.push({
            name : client.currentTest.name,
            module : client.currentTest.module,
            group : client.currentTest.group
          });
          done();
        }
      }
    }, {
      output_folder : 'output',
      start_session : true,
      src_folders : src_folders,
      reporter : 'junit'
    }, function(err, results) {
      test.equals(err, null);
      test.deepEqual(currentTestArray, [
        { name: '', module: 'simple/sample', group : 'simple' },
        { name: '', module: 'tags/sampleTags', group : 'tags' }
      ]);

      var fs = require('fs');
      fs.readdir(src_folders[0], function(err, list) {
        test.deepEqual(list, ['simple', 'tags'], 'The subfolders have been created.');
        var simpleReportFile = 'output/simple/FIREFOX_TEST_TEST_sample.xml';
        var tagsReportFile = 'output/tags/FIREFOX_TEST_TEST_sampleTags.xml';

        test.ok(fs.existsSync(simpleReportFile), 'The simple report file was not created.');
        test.ok(fs.existsSync(tagsReportFile), 'The tags report file was not created.');
        test.done();
      });

    });
  },

  testRunUnitTests : function(test) {
    var testsPath = path.join(process.cwd(), '/sampletests/unittests');
    test.expect(3);
    this.Runner.run([testsPath], {
      silent : true,
      output : false,
      globals : {
        test : test
      }
    }, {
      output_folder : false,
      start_session : false
    }, function(err, results) {
      test.equals(err, null);
      test.done();
    });
  },

  testRunWithChaiExpect : function(test) {
    var testsPath = path.join(process.cwd(), '/sampletests/withchaiexpect');
    test.expect(6);

    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      }
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.equals(err, null);
      test.equals(results.modules.sampleWithChai.tests, 2);
      test.equals(results.modules.sampleWithChai.failures, 0);
      test.done();
    });
  }
};
