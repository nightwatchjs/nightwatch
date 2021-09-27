const Runner = require('./default');
const CucumberSuite = require('../../testsuite/cucumber');


class CucumberRunnner extends Runner {
  get supportsConcurrency() {
    return true;
  }
  createTestSuite({modulePath, modules}) {
    const {settings, argv, addtOpts} = this;
    const testSuite = new CucumberSuite({modulePath, modules, settings, argv, addtOpts});
    testSuite.init();

    return testSuite;
  }
  runTests(modules) {
    const modulePath = modules.slice(0).shift();
    this.currentSuite = this.createTestSuite({modulePath, modules});

    return this.currentSuite.runTestSuite();
  } 
}

module.exports = CucumberRunnner;
