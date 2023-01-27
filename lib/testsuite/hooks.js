const BaseHook = require('./hooks/_basehook.js');

class TestHooks {
  static get TEST_HOOKS () {
    return {
      [BaseHook.beforeAll]: require('./hooks/beforeAll.js'),
      [BaseHook.beforeEach]: require('./hooks/beforeEach.js'),
      [BaseHook.beforeChildProcess]: require('./hooks/beforeChildProcess.js'),
      [BaseHook.afterEach]: require('./hooks/afterEach.js'),
      [BaseHook.afterAll]: require('./hooks/afterAll.js'),
      [BaseHook.afterChildProcess]: require('./hooks/afterChildProcess.js')
    };
  }

  constructor(context, addtOpts) {
    this.context = context;

    Object.keys(TestHooks.TEST_HOOKS).forEach(key => {
      this[key] = new TestHooks.TEST_HOOKS[key](this.context, addtOpts);
    });
  }
}

module.exports = TestHooks;
