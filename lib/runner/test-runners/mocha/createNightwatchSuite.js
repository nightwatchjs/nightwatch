const TestSuite = require('../../../testsuite');

module.exports = ({suite, modules = [], settings, argv, addtOpts}) => {
  const nightwatchSuite = new TestSuite({
    modules,
    settings,
    argv,
    usingMocha: true,
    addtOpts,
    modulePath: null
  });

  nightwatchSuite.initCommon({
    suiteTitle: suite.title
  });

  return nightwatchSuite;
};