/**
 * Created by paul on 1/3/15.
 */

var path = require('path');

'use strict';
module.exports = new (function() {

	/*

	 ##teamcity[testSuiteStarted name='suiteName']

	 ##teamcity[testSuiteStarted name='nestedSuiteName']
	 ##teamcity[testStarted name='package_or_namespace.ClassName.TestName']
	 ##teamcity[testFailed name='package_or_namespace.ClassName.TestName' message='The number should be 20000' details='junit.framework.AssertionFailedError: expected:<20000> but was:<10000>|n|r    at junit.framework.Assert.fail(Assert.java:47)|n|r    at junit.framework.Assert.failNotEquals(Assert.java:280)|n|r...']
	 ##teamcity[testFinished name='package_or_namespace.ClassName.TestName']
	 ##teamcity[testSuiteFinished name='nestedSuiteName']
	 ##teamcity[testSuiteFinished name='suiteName']

	 */

	var currentSuite = null;

	this.testSuiteStarted = function (moduleKey) {
		var paths = moduleKey.split('/');
		if (paths.length && currentSuite !== paths[0]) {
			// Finish the previous suite.
			this.testSuiteFinished();

			currentSuite = paths[0];
			console.log("##teamcity[testSuiteStarted name='" + currentSuite + "']");
		}
	};

	this.testSuiteFinished = function () {
		if (currentSuite) {
			console.log("##teamcity[testSuiteFinished name='" + currentSuite + "']");
			currentSuite = null;
		}
	};

	this.testStarted = function (moduleKey) {
		console.log("##teamcity[testStarted name='" + moduleKey + "']");
	};

	this.testFinished = function (moduleKey, results, errors) {
		if (results.failed || results.errors) {

			// Get the last results.tests as that will be the failure.
			var failure = results.tests[results.tests.length - 1],
					details = failure.stacktrace.replace(/\n/g, '|n|r');

			console.log("##teamcity[testFailed name='" + moduleKey + "' message='" + failure.message + "' details='" + details + "']");
		} else {
			console.log("##teamcity[testFinished name='" + moduleKey + "']");
		}
	};

})();
