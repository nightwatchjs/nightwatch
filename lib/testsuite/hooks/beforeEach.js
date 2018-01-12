const BaseHook = require('./_basehook.js');

class BeforeAll extends BaseHook {
  constructor(context, addtOpts) {
    super(BaseHook.beforeEach, context, addtOpts);
  }
}

module.exports = BeforeAll;