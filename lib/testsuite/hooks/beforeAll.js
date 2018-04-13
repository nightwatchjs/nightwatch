const BaseHook = require('./_basehook.js');

class BeforeAll extends BaseHook {
  get skipTestcasesOnError() {
    return true;
  }

  constructor(context, addtOpts) {
    super(BaseHook.beforeAll, context, addtOpts);
  }
}

module.exports = BeforeAll;