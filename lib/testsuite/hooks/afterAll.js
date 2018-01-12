const BaseHook = require('./_basehook.js');

class AfterAll extends BaseHook {
  constructor(context, addtOpts) {
    super(BaseHook.afterAll, context, addtOpts);
  }
}

module.exports = AfterAll;