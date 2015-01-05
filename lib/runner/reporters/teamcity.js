/**
 * Created by pstuart2 on 1/3/15.
 */

var path = require('path');

'use strict';
module.exports = new (function() {

	var
			/**
			 * This is the current test suite we are running. We are counting the top most directory as the
			 * test suite. We use this to see when we change and then know when to call testSuiteFinished().
			 *
			 * @type {null}|{string}
			 */
			_currentSuite = null,

			/**
			 * This is just holds the status of our environment check so that we only have to hit it once.
			 *
			 * @type {null}|{boolean}
			 * @private
			 */
			_isTeamCity = null;

	/**
	 * Returns true if we are running in a TeamCity environment, else false.
	 *
	 * @returns {boolean}
	 */
	this.isTeamCity = function() {
		if (_isTeamCity === null) {
			// If the TEAMCITY_DATA_PATH is defined then we are being run from TeamCity.
			_isTeamCity = !! process.env.TEAMCITY_DATA_PATH;
		}

		return _isTeamCity;
	};

	/**
	 * Starts a test suite. A test suite is currently the top most directory of the module key.
	 *
	 * @param moduleKey
	 */
	this.testSuiteStarted = function (moduleKey) {
		if (!this.isTeamCity()) { return; }

		var paths = moduleKey.split('/');
		if (paths.length && _currentSuite !== paths[0]) {
			// Finish the previous suite.
			this.testSuiteFinished();

			_currentSuite = paths[0];
			console.log("##teamcity[testSuiteStarted name='" + _currentSuite + "']");
		}
	};

	/**
	 * Finishes a test suite. Called internally except for after all tests complete, then
	 * it must be called manually the last time.
	 */
	this.testSuiteFinished = function () {
		if (!this.isTeamCity()) { return; }

		if (_currentSuite) {
			console.log("##teamcity[testSuiteFinished name='" + _currentSuite + "']");
			_currentSuite = null;
		}
	};

	/**
	 * Starts a test.
	 *
	 * @param moduleKey
	 */
	this.testStarted = function (moduleKey) {
		if (!this.isTeamCity()) { return; }
		console.log("##teamcity[testStarted name='" + moduleKey + "']");
	};

	/**
	 * Completes the test providing TeamCity with the pass / fail.
	 *
	 * @param moduleKey
	 * @param results
	 */
	this.testFinished = function (moduleKey, results) {
		if (!this.isTeamCity()) { return; }

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
