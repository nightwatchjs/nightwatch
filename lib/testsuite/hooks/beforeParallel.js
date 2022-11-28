const BaseHook = require('./_basehook.js');

class BeforeParallel extends BaseHook {
  constructor(context, addtOpts) {
    super(BaseHook.beforeParallel, context, addtOpts);
  }
}

module.exports = BeforeParallel;
