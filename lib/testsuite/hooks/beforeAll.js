const BaseHook = require('./_basehook.js');

class BeforeAll extends BaseHook {
  constructor(context, addtOpts) {
    super(BaseHook.beforeAll, context, addtOpts);
  }


}

module.exports = BeforeAll;