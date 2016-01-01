var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var path = require('path');

module.exports = {
  setUp: function (cb) {
    this.Runner = require('../../../' + BASE_PATH + '/runner/run.js');
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    cb();
  },

  tearDown: function (callback) {
    delete require.cache[require.resolve('../../../' + BASE_PATH + '/runner/run.js')];
    callback();
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
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.ok(('demoTagTest' in results.modules.sample.completed), 'demoTagTest was ran');
      test.ok(Object.keys(results.modules).length === 1, 'There was only 1 test running.');
      test.done();
    });
  },

  testRunWithTagsAndFilterEmpty : function(test) {
    var testsPath = path.join(process.cwd(), 'sampletests');

    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      },
      filter : 'syncnames/*',
      tag_filter : ['login']
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.ok(err);
      test.equal(results, false);
      test.done();
    });
  },

  testRunWithTagsAndFilterNotEmpty : function(test) {
    var testsPath = path.join(process.cwd(), 'sampletests');

    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      },
      filter : 'tags/*',
      tag_filter : ['login']
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.equal(err, null);
      test.ok(('demoTagTest' in results.modules.sample.completed), 'demoTagTest was ran');
      test.done();
    });
  }
};
