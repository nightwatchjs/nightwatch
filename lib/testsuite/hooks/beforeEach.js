const BaseHook = require('./_basehook.js');

class BeforeAll extends BaseHook {
  get skipTestcasesOnError() {
    return true;
  }

  constructor(context, addtOpts) {
    super(BaseHook.beforeEach, context, addtOpts);
  }
}

module.exports = BeforeAll;