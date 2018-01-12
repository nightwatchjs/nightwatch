const BaseHook = require('./_basehook.js');

class AfterEach extends BaseHook {
  constructor(context, addtOpts) {
    super(BaseHook.afterEach, context, addtOpts);
  }
}

module.exports = AfterEach;