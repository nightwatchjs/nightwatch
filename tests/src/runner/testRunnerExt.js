var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';

var simpleSampleTest = require('../../sampletests/simple/sample');
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

	'load modules externally execute tests with runTestModule': function(test) {

		//console.log(simpleSampleTest);

		var modules = [];

		simpleSampleTest.moduleName = 'demoTest';
		modules.push(simpleSampleTest);

		var opts = {
			seleniumPort: 10195,
			silent: true,
			output: false,
			globals: {
				test: test
			}
		};

		this.Runner.init(opts, {
			output_folder: false
		}, function(err, results) {

			test.equals(err, null);
			test.ok('simple/sample' in results.modules);
			test.ok('demoTest' in results.modules['simple/sample']);
			test.done();
		});

		this.Runner.runTestModule(null, modules);
	}
};
